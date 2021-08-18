import exporter from "highcharts-export-server";
import { getExportSettings } from "./export_settings/getExportSettingsFile.js";

const exportToImg = (exportSettings) => {
    return new Promise((resolve, reject) => {

        exporter.export(exportSettings, function (err, res) {
            //If the output is not PDF or SVG, it will be base64 encoded (res.data).
            //If the output is a PDF or SVG, it will contain a filename (res.filename).

            if (res.data) {
                resolve(res.data);
            }
            else {
                console.log(err)
                reject(err);
            }

        });
    })
}


export const exportLoop = (reqJSONArray) => {
    return new Promise((resolve, reject) => {
        const toBeDone = reqJSONArray.length;
        let done = 0;
        let resultArray = new Array(toBeDone);
        for (let i = 0; i < toBeDone; i++) {
            let arrayData = reqJSONArray[i];

            // pass parameter to getExportSettings
            let exportSettings = getExportSettings(arrayData);

            exportToImg(exportSettings).then(response => {
                resultArray[i] = response;
                console.log("" + process.pid + " done", i);
                done += 1;
                if (done === toBeDone) {

                    resolve(resultArray);
                }
            })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        }
    })

}
