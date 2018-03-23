"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const lsdisks = require("ls-disks");
const child_process = require("child_process");
const pathExists = require("path-exists");
function checkpart(part) {
    return new Promise((resolve, reject) => {
        const partitions = lsdisks.listPartitions();
        let thepartition;
        let exists = false;
        for (let p = 0; p < partitions.length; p++) {
            if (partitions[p].name === part || partitions[p].partition === part || partitions[p].label === part) {
                thepartition = partitions[p];
                exists = true;
            }
        }
        if (exists) {
            resolve(thepartition);
        }
        else {
            reject("partition " + part + " not founded");
        }
    });
}
function mount(part, dir) {
    return new Promise((resolve, reject) => {
        checkpart(part).then((parti) => {
            child_process.exec("sudo mount " + parti.partition + " " + dir, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
exports.mount = mount;
function mountLockedWithBitLocker(part, dir, dislockerDir) {
    return new Promise((resolve, reject) => {
        checkpart(part).then((parti) => {
            if (!dislockerDir && pathExists.sync('/mnt/dislocker'))
                dislockerDir = '/mnt/dislocker';
            if (!dislockerDir)
                return reject('no dislocker folder found');
            if (!pathExists.sync(dislockerDir))
                child_process.execSync('sudo mkdir -p ' + dislockerDir + ' && sudo chmod 777 ' + dislockerDir);
            if (!pathExists.sync(dir))
                child_process.execSync('sudo mkdir -p ' + dir + ' && sudo chmod 777 ' + dir);
            child_process.exec("sudo dislocker -V " + parti.partition + " -ubitlocker -- " + dislockerDir, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                else {
                    child_process.exec("sudo mount  -o loop,rw " + dislockerDir + "/dislocker-file " + dir, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
exports.mountLockedWithBitLocker = mountLockedWithBitLocker;
function umountLockedWithBitLocker(dir, dislockerDir) {
    return new Promise((resolve, reject) => {
        if (!dislockerDir && pathExists.sync('/mnt/dislocker'))
            dislockerDir = '/mnt/dislocker';
        if (!dislockerDir)
            return reject('no dislocker folder found');
        if (!pathExists.sync(dir))
            return reject('no mount point finded to umount');
        if (!pathExists.sync(dislockerDir))
            return reject('no dislocker finded to umount');
        child_process.exec("sudo umount " + dir, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            else {
                child_process.exec("sudo umount " + dislockerDir, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            }
        });
    });
}
exports.umountLockedWithBitLocker = umountLockedWithBitLocker;
function umount(dirOrPart) {
    return new Promise((resolve, reject) => {
        child_process.exec("cat /etc/mtab | grep -c '" + dirOrPart + "'", (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            else if (parseInt(stdout) > 0) {
                child_process.exec("sudo umount " + dirOrPart, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            }
            else {
                reject("not mounted");
            }
        });
    });
}
exports.umount = umount;
function remount(part, mode, otheroptions) {
    return new Promise((resolve, reject) => {
        checkpart(part).then((parti) => {
            let cmd = "sudo mount " + parti.partition + " -o remount," + mode;
            if (otheroptions) {
                cmd + ',' + otheroptions;
            }
            child_process.exec("cat /etc/mtab | grep -c '" + parti.partition + "'", (err, stdout, stderr) => {
                if (err) {
                    reject('not founded, or disk error');
                }
                else if (parseInt(stdout) > 0) {
                    child_process.exec(cmd, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
                else {
                    reject("not mounted");
                }
            });
        }).catch((err) => {
            reject(err);
        });
    });
}
exports.remount = remount;
