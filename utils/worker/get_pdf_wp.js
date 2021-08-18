import { exportToPDF } from "../export_modes/exportToPDF.js";
import exporter from "highcharts-export-server";
import { exportLoop } from "../exportUtil.js";

const timeThreshold = 10000;

process.on("message", message => {

    // message passed by the parent process holds dataArray 
    // dataArray is list of chart details 
    // chart details => {
    //     "chartType": "type",
    //     "reportObjDetails": "details",
    //     "data": "data" 
    // } 

    let arrayInput = message.dataArray;
    processRequest(arrayInput).then(result => {
        process.send({ message: result }, function(){
            process.exit();
        })
    }).catch((err) => {
        console.log(err);
        process.send({ 
            message: err, 
            error : err 
        });
        process.exit();
    })

})

const processRequest = (dataToProcess)=>{
    return new Promise ((resolve, reject)=>{
        var reqJSONArray = dataToProcess;
        exporter.initPool({
            maxWorkers : 1, 
            threshold : timeThreshold
        });
        
        exportLoop(reqJSONArray).then(response => {  
            // exportToPDF(response).then(()=>{
            //     resolve({
            //         data : response
            //     });
            // }).catch(err=>{
            //     console.log(err);
            //     reject(errMsg);
            // });    
            exportToPDF(response);
            resolve({
                data : response
            });    
            
        }).catch(err=>{
            console.log(err);
            reject(errMsg); 
        })
    }) 

}

const errMsg = {
    notOk : "could not convert to PDF!",
}; 