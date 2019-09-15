var TesseractWorker = (function (tesseractWorker) {

    const { TesseractWorker, OEM, PSM } = Tesseract;
    const worker = new TesseractWorker();

    tesseractWorker.loadImage = function (img, progressCallback, finallyCallback) {
        worker
            //.recognize(img, 'digits_comma',
            .recognize(img, 'deu',
                {
                    tessedit_ocr_engine_mode: OEM.OEM_LSTM_ONLY,
                    //tessedit_pageseg_mode: PSM.PSM_SINGLE_COLUMN
                    tessedit_pageseg_mode: PSM.PSM_SINGLE_BLOCK
                }
            )
            .progress((p) => {
                    progressCallback(p);
                })
                .then((obj) => {
                    worker.terminate();
                    finallyCallback(obj);
                });
    };

    tesseractWorker.stop = function () {
        worker.terminate();
    };

    return tesseractWorker;
  }(TesseractWorker || {}));
