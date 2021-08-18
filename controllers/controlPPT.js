import { fork } from "child_process";

export const getPPTCtrl = (req, res) => {

    const childProcess = fork("./utils/worker/get_ppt_wp.js");
    childProcess.send(req.body);
    childProcess.on("message", (response) => {
        if (response.error) {
        res.statusCode = 500;
        res.send(response.error["notOk"])
        }
        else{
        res.json(response.message); 
        }
    });
};