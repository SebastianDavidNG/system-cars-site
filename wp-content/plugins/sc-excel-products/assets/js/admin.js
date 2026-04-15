/**
 * SC Excel Products - Admin JavaScript
 */
(function($) {
    'use strict';

    // Elements
    const $dropzone = $('#sc-dropzone');
    const $fileInput = $('#sc-import-file');
    const $fileInfo = $('#sc-file-info');
    const $fileName = $('#sc-file-name');
    const $fileRemove = $('#sc-file-remove');
    const $preview = $('#sc-preview');
    const $previewSummary = $('#sc-preview-summary');
    const $previewBody = $('#sc-preview-body');
    const $importActions = $('#sc-import-actions');
    const $importBtn = $('#sc-import-btn');
    const $exportBtn = $('#sc-export-btn');
    const $progress = $('#sc-progress');
    const $progressFill = $('#sc-progress-fill');
    const $progressText = $('#sc-progress-text');
    const $results = $('#sc-results');
    const $resultsSummary = $('#sc-results-summary');
    const $resultsMessages = $('#sc-results-messages');

    let selectedFile = null;

    /**
     * Initialize
     */
    function init() {
        bindEvents();
    }

    /**
     * Bind events
     */
    function bindEvents() {
        // Dropzone click
        $dropzone.on('click', function() {
            $fileInput.trigger('click');
        });

        // Dropzone drag events
        $dropzone.on('dragover dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('dragover');
        });

        $dropzone.on('dragleave dragend drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
        });

        $dropzone.on('drop', function(e) {
            const files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        // File input change
        $fileInput.on('change', function() {
            if (this.files.length > 0) {
                handleFileSelect(this.files[0]);
            }
        });

        // Remove file
        $fileRemove.on('click', function(e) {
            e.stopPropagation();
            resetFileSelection();
        });

        // Export button
        $exportBtn.on('click', function() {
            window.location.href = scExcelProducts.exportUrl;
        });

        // Import button
        $importBtn.on('click', function() {
            if (!selectedFile) {
                alert(scExcelProducts.strings.noFile);
                return;
            }

            if (confirm(scExcelProducts.strings.confirmImport)) {
                startImport();
            }
        });
    }

    /**
     * Handle file selection
     */
    function handleFileSelect(file) {
        // Validate file type
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(ext)) {
            alert(scExcelProducts.strings.invalidFile);
            return;
        }

        selectedFile = file;
        $fileName.text(file.name);
        $dropzone.hide();
        $fileInfo.show();
        $results.hide();

        // Load preview
        loadPreview(file);
    }

    /**
     * Reset file selection
     */
    function resetFileSelection() {
        selectedFile = null;
        $fileInput.val('');
        $fileInfo.hide();
        $dropzone.show();
        $preview.hide();
        $importActions.hide();
        $progress.hide();
        $results.hide();
    }

    /**
     * Load file preview
     */
    function loadPreview(file) {
        const formData = new FormData();
        formData.append('action', 'sc_import_preview');
        formData.append('nonce', scExcelProducts.importNonce);
        formData.append('file', file);

        $preview.hide();
        $importActions.hide();
        $progress.show();
        $progressFill.css('width', '50%');
        $progressText.text(scExcelProducts.strings.uploading);

        $.ajax({
            url: scExcelProducts.ajaxUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $progress.hide();
                $progressFill.css('width', '0%');

                if (response.success) {
                    showPreview(response.data);
                } else {
                    alert(response.data.message || scExcelProducts.strings.error);
                    resetFileSelection();
                }
            },
            error: function() {
                $progress.hide();
                $progressFill.css('width', '0%');
                alert(scExcelProducts.strings.error);
                resetFileSelection();
            }
        });
    }

    /**
     * Show preview data
     */
    function showPreview(data) {
        // Summary
        let summaryHtml = '';
        summaryHtml += '<span>Total: <span class="count">' + data.totals.total + '</span> filas</span>';
        summaryHtml += '<span>Productos: <span class="count">' + data.totals.products + '</span></span>';
        summaryHtml += '<span>Variaciones: <span class="count">' + data.totals.variations + '</span></span>';
        $previewSummary.html(summaryHtml);

        // Table
        let tableHtml = '';
        data.preview.forEach(function(row) {
            const typeClass = row.type === 'variation' ? 'type-variation' : '';
            const actionClass = 'action-' + row.action;
            const actionText = row.action === 'create' ? 'Crear' : 'Actualizar';

            tableHtml += '<tr>';
            tableHtml += '<td>' + row.row + '</td>';
            tableHtml += '<td class="' + typeClass + '">' + row.type + '</td>';
            tableHtml += '<td>' + (row.sku || '-') + '</td>';
            tableHtml += '<td>' + (row.name || '-') + '</td>';
            tableHtml += '<td>' + (row.price || '-') + '</td>';
            tableHtml += '<td class="' + actionClass + '">' + actionText + '</td>';
            tableHtml += '</tr>';
        });

        if (data.totals.total > 10) {
            tableHtml += '<tr><td colspan="6" style="text-align: center; font-style: italic;">... y ' + (data.totals.total - 10) + ' filas más</td></tr>';
        }

        $previewBody.html(tableHtml);

        $preview.show();
        $importActions.show();
    }

    /**
     * Start import process
     */
    function startImport() {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('action', 'sc_import_products');
        formData.append('nonce', scExcelProducts.importNonce);
        formData.append('file', selectedFile);

        // Show progress
        $preview.hide();
        $importActions.hide();
        $results.hide();
        $progress.show();
        $progressFill.css('width', '0%');
        $progressText.text(scExcelProducts.strings.processing);

        // Animate progress
        let progressValue = 0;
        const progressInterval = setInterval(function() {
            progressValue += Math.random() * 10;
            if (progressValue > 90) progressValue = 90;
            $progressFill.css('width', progressValue + '%');
        }, 500);

        $.ajax({
            url: scExcelProducts.ajaxUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                clearInterval(progressInterval);
                $progressFill.css('width', '100%');
                $progressText.text(scExcelProducts.strings.complete);

                setTimeout(function() {
                    $progress.hide();

                    if (response.success) {
                        showResults(response.data);
                    } else {
                        alert(response.data.message || scExcelProducts.strings.error);
                    }
                }, 500);
            },
            error: function() {
                clearInterval(progressInterval);
                $progress.hide();
                alert(scExcelProducts.strings.error);
            }
        });
    }

    /**
     * Show import results
     */
    function showResults(data) {
        const results = data.results;

        // Summary
        let summaryHtml = '';
        summaryHtml += '<div class="result-item created"><span class="result-number">' + results.created + '</span><span class="result-label">' + scExcelProducts.strings.created + '</span></div>';
        summaryHtml += '<div class="result-item updated"><span class="result-number">' + results.updated + '</span><span class="result-label">' + scExcelProducts.strings.updated + '</span></div>';
        summaryHtml += '<div class="result-item skipped"><span class="result-number">' + results.skipped + '</span><span class="result-label">' + scExcelProducts.strings.skipped + '</span></div>';
        summaryHtml += '<div class="result-item errors"><span class="result-number">' + results.errors + '</span><span class="result-label">' + scExcelProducts.strings.errors + '</span></div>';
        $resultsSummary.html(summaryHtml);

        // Messages
        let messagesHtml = '';
        if (results.messages && results.messages.length > 0) {
            results.messages.forEach(function(msg) {
                const msgClass = msg.toLowerCase().includes('error') ? 'error' : 'success';
                messagesHtml += '<p class="' + msgClass + '">' + msg + '</p>';
            });
        }
        $resultsMessages.html(messagesHtml);

        $results.show();

        // Reset file selection for next import
        selectedFile = null;
        $fileInput.val('');
        $fileInfo.hide();
        $dropzone.show();
    }

    // Initialize on document ready
    $(document).ready(init);

})(jQuery);
