import { exportToPPT } from "../export_modes/exportToPPT.js";
import { exportLoop } from "../exportUtil.js";
import exporter from "highcharts-export-server";

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
// process.on("exit", ()=>{
//     console.log(`process ${process.pid} exited`)
// })

const processRequest = (dataToProcess)=>{
    return new Promise ((resolve, reject)=>{
        var reqJSONArray = dataToProcess;
        exporter.initPool({
            maxWorkers : 1, 
            threshold : timeThreshold
        });
        
        exportLoop(reqJSONArray).then(response => {  
            exportToPPT(response).then(()=>{
                resolve({
                    data : response
                });
            }).catch(err=>{
                console.log(err);
                reject(errMsgPpt);
            });          
        }).catch(err=>{
            console.log(err);
            reject(errMsgImg); 
        })
    }) 

}
const errMsgPpt = {
    notOk : "could not convert to PPT!"
}
const errMsgImg = {
    notOk : "could not convert to image!"
}; 