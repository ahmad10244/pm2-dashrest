const QueryLinesReader = require('query-lines-reader');
const { exec } = require("child_process");
const pm2 = require("pm2")
const pmx = require('pmx');
const morgan = require("morgan")
const Promise = require('promise');
const express = require("express")
const app = express()

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'))
app.use(express.json())

pmx.initModule({
    widget: {
        // 0 = main element
        // 1 = secondary
        // 2 = main border
        // 3 = secondary border
        theme: ['#9F1414', '#591313', 'white', 'white'],

        el: {
            probes: true,
            actions: true
        },

        block: {
            actions: false,
            issues: true,
            meta: true,
            main_probes: []
        }
    }
}, function (err, conf) {
    var pp = conf.port

    function pm2List() {
        const pm2_list = new Promise((resolve, reject) => {
            pm2.list((err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_list
    }
    
    function pm2Describe(processName) {
        const pm2_desc = new Promise((resolve, reject) => {
            pm2.describe(processName, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_desc
    }
    
    function pm2StartProcess(processConf) {
        const pm2_list = new Promise((resolve, reject) => {
            pm2.start(processConf, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_list
    }
    
    function pm2StopProcess(processName) {
        const pm2_list = new Promise((resolve, reject) => {
            pm2.stop(processName, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_list
    }
    
    function pm2RestartProcess(processName) {
        const pm2_list = new Promise((resolve, reject) => {
            pm2.restart(processName, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_list
    }
    
    function pm2ReloadProcess(processName) {
        const pm2_list = new Promise((resolve, reject) => {
            pm2.reload(processName, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_list
    }
    
    function pm2DeleteProcess(processName) {
        const pm2_list = new Promise((resolve, reject) => {
            pm2.delete(processName, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        });
    
        return pm2_list
    }
    
    
    function pm2Save(){
        exec("pm2 save --force", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
        });
    }
    
    
    app.get("/process/list", (req, res) => {
        pm2List()
            .then(list => res.status(200).json(list))
            .catch(err => console.log(err));
    })
    
    
    app.get("/process/describe", (req, res) => {
        pm2Describe(req.query['processName'])
            .then(list => res.status(200).json(list))
            .catch(err => console.log(err));
    })
    
    
    app.post("/process/start", (req, res) => {
        pm2StartProcess(req.body)
            .then(list => {
                pm2Save();
                res.status(200).json(list);
            })
            .catch(err => console.log(err));
    })
    
    app.put("/process/:action", (req, res) => {
        switch (req.params.action) {
            case "restart":
                pm2RestartProcess(req.query['processName'])
                    .then(list => res.status(200).json(list))
                    .catch(err => console.log(err));
                break;
            case "stop":
                pm2StopProcess(req.query['processName'])
                    .then(list => res.status(200).json(list))
                    .catch(err => console.log(err));
                break;
            case "reload":
                pm2ReloadProcess(req.query['processName'])
                    .then(list => res.status(200).json(list))
                    .catch(err => console.log(err));
                break;
        }
    })
    
    app.delete("/process/delete", (req, res) => {
        pm2DeleteProcess(req.query['processName'])
            .then(list => {
                pm2Save();
                res.status(200).json(list);
            })
            .catch(err => console.log(err));
    })
    
    
    app.get("/process/logs", (req, res) => {
        let pName = req.query['processName']
    
        pm2Describe(pName)
            .then(list => {
                let page = req.query.page
                let pageSize = req.query.pageSize
                let reverse = req.query.reverse
                let output = req.query.output
    
                const filePath = output == "err" ? list[0].pm2_env.pm_err_log_path : list[0].pm2_env.pm_out_log_path
    
                let queryLinesReader = new QueryLinesReader(filePath, {
                    reverse: reverse,
                    needTotal: true,
                    pageSize: parseInt(pageSize)
                });
    
                queryLinesReader.queryLines({
                    currentPage: parseInt(page)
                }).then(fileRes => {
                    const ret = {
                        "totalLines": fileRes.total,
                        "lines": fileRes.lineList
                    }
                    res.status(200).json(ret)
                })
            })
            .catch(err => console.log(err));
    })
    
    
    app.listen(pp, function () {
        console.log(`Listening on port ${pp}`);
    })
})
