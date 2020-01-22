const PDFDocument = require("pdfkit");
const WritableBufferStream = require("./stream");


exports.data = (details) => {
    return new Promise(async function (resolve, reject) {
        try {
            let docTitle = "Primechain-credentials";
            let textColour = [0, 0, 0];
            let headerColour = [100, 100, 100];

            var doc = new PDFDocument({
                layout: "portrait",
                size: "A4",
                margin: 50,
                info: {
                    Producer: 'Primechain Technologies',
                    Creator: 'Primechain Technologies',
                    Title: docTitle
                },
                autoFirstPage: false
            });
            let d = JSON.stringify(details.details)
            // // 1. Title
            // doc.addPage()
            //     .font("Helvetica", null, 250)
            //     .text(" ", { lineBreak: true })
            //     .font('Helvetica-Bold', null, 24)
            //     .fillColor(textColour)
            //     .text(docTitle, { align: 'center' });

            // Header, Recipients & Disclosers, Jurisdiction
            doc.addPage()
                // Header
                .font("Helvetica", null, 17)
                .fillColor(headerColour)
                .text(docTitle, { align: 'center' })
                .font("Helvetica", null, 20)
                .text(" ", { lineBreak: true })
                // Recipients & Disclosers
                // .font("Helvetica", null, 20)
                // .fillColor(textColour)
                // .text("Recipients & Disclosers of Confidential Information:")
                // .font("Helvetica", null, 24)
                // .text(" ", { lineBreak: true })
                .font("Helvetica", null, 12)
                // .text(party_details)
                .font("Helvetica", null, 16)
                .text(" ", { lineBreak: true })
                // Jurisdiction
                .font("Helvetica", null, 20)
                .text("blockchain_info")
                .font("Helvetica", null, 16)
                .text(" ", { lineBreak: true })
                .font("Helvetica", null, 12)
                .text(`${d}`, { lineBreak: true });

            // Header, The agreement
            // doc.addPage()
            //     // Header
            //     .font("Helvetica", null, 17)
            //     .fillColor(headerColour)
            //     .text(docTitle, { align: 'center' })
            //     .font("Helvetica", null, 20)
            //     .text(" ", { lineBreak: true })
            // The agreement
            // .fillColor(textColour)
            // .font("Helvetica", null, 20)
            // .text("The agreement")
            // .font("Helvetica", null, 16)
            // .text(" ", { lineBreak: true })
            // .font("Helvetica", null, 12)
            // .text(agreement_details);

            let writeStream = new WritableBufferStream();
            doc.pipe(writeStream);

            //# Finalize PDF file
            doc.end();

            // wait for the writing to finish
            writeStream.on('finish', () => {
                return resolve({
                    "data": writeStream.toBuffer()
                });
            });
        }
        catch (err) {
            return reject({
                "message": err
            });
        }

    });
};