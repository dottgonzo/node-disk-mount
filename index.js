"use strict";
var Promise = require("bluebird");
var lsdisks = require("ls-disks");
var child_process = require("child_process");
function checkpart(part) {
    var partitions = lsdisks.all();
    var thepartition;
    var exists = false;
    for (var p = 0; p < partitions.length; p++) {
        if (partition[p].name === part || partition[p].partition === part || partition[p].label === part) {
            thepartition = partition[p];
            exists = true;
        }
    }
    if (exists) {
        return thepartition;
    }
    else {
        throw Error("partition " + part + " not founded");
    }
}
function mount(part, dir) {
    return new Promise(function (resolve, reject) {
        var parti;
        try {
            parti = checkpart(part);
        }
        catch (err) {
            reject(err);
        }
        if (checkpart(part)) {
            child_process.exec("mount " + parti.partition + " " + dir, function (err, stdout, stderr) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        }
        else {
            reject("not present");
        }
    });
}
exports.mount = mount;
function umount(dir) {
    return new Promise(function (resolve, reject) {
        child_process.exec("cat /etc/mtab | grep -c '" + dir + "'", function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else if (parseInt(stdout) > 0) {
                child_process.exec("ummount " + dir, function (err, stdout, stderr) {
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
    return new Promise(function (resolve, reject) {
        var parti;
        try {
            parti = checkpart(part);
        }
        catch (err) {
            reject(err);
        }
        var cmd = "mount " + parti.partition + " -o remount," + mode;
        if (otheroptions) {
            cmd + ',' + otheroptions;
        }
        child_process.exec("cat /etc/mtab | grep -c '" + part + "'", function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else if (parseInt(stdout) > 0) {
                child_process.exec(cmd, function (err, stdout, stderr) {
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
exports.remount = remount;
var partition = (function () {
    function partition(part) {
        var shortpart;
        var extpart;
        var disks = lsdisks.all();
        if (part.split('/').length > 1) {
            extpart = part;
            shortpart = part.split('/')[part.split('/').length - 1];
        }
        else {
        }
    }
    return partition;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = partition;

//# sourceMappingURL=data:application/json;base64,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SSxDQUFDLENBQUM7UUFLUixDQUFDO0lBR0wsQ0FBQztJQUlMLGdCQUFDO0FBQUQsQ0ExQkEsQUEwQkMsSUFBQTtBQTFCRDsyQkEwQkMsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFByb21pc2UgZnJvbSBcImJsdWViaXJkXCI7XG5pbXBvcnQgKiBhcyBsc2Rpc2tzIGZyb20gXCJscy1kaXNrc1wiO1xuaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG5cbmludGVyZmFjZSBJUGFydGl0aW9uIHtcbiAgICBwYXJ0aXRpb246IHN0cmluZztcbiAgICBzZWN0b3JzOiBudW1iZXI7XG4gICAgc2VjdG9yc19zdGFydDogbnVtYmVyO1xuICAgIHNlY3RvcnNfc3RvcDogbnVtYmVyO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBib290OiBib29sZWFuO1xuICAgIHNpemU6IG51bWJlcjtcbiAgICBsYWJlbD86IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cblxuZnVuY3Rpb24gY2hlY2twYXJ0KHBhcnQ6IHN0cmluZyk6IElQYXJ0aXRpb24ge1xuXG4gICAgY29uc3QgcGFydGl0aW9ucyA9IGxzZGlza3MuYWxsKCk7XG5cbiAgICBsZXQgdGhlcGFydGl0aW9uOiBJUGFydGl0aW9uO1xuICAgIGxldCBleGlzdHMgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8IHBhcnRpdGlvbnMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgaWYgKHBhcnRpdGlvbltwXS5uYW1lID09PSBwYXJ0IHx8IHBhcnRpdGlvbltwXS5wYXJ0aXRpb24gPT09IHBhcnQgfHwgcGFydGl0aW9uW3BdLmxhYmVsID09PSBwYXJ0KSB7XG4gICAgICAgICAgICB0aGVwYXJ0aXRpb24gPSBwYXJ0aXRpb25bcF1cbiAgICAgICAgICAgIGV4aXN0cyA9IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoZXBhcnRpdGlvblxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJwYXJ0aXRpb24gXCIgKyBwYXJ0ICsgXCIgbm90IGZvdW5kZWRcIilcbiAgICB9XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdW50KHBhcnQ6IHN0cmluZywgZGlyOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBtYW5jYSBpbCBjb250cm9sbG8gZGVsIHNlIGdpw6Agw6ggbW9udGF0b1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBwYXJ0aTogSVBhcnRpdGlvbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhcnRpID0gY2hlY2twYXJ0KHBhcnQpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGVja3BhcnQocGFydCkpIHtcbiAgICAgICAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhcIm1vdW50IFwiICsgcGFydGkucGFydGl0aW9uICsgXCIgXCIgKyBkaXIsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KFwibm90IHByZXNlbnRcIilcbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuZXhwb3J0IGZ1bmN0aW9uIHVtb3VudChkaXI6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIGlsIGNvbnRyb2xsbyBkZWwgbW91bnRwb2ludCDDqCBpbXByZWNpc29cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY2hpbGRfcHJvY2Vzcy5leGVjKFwiY2F0IC9ldGMvbXRhYiB8IGdyZXAgLWMgJ1wiICsgZGlyICsgXCInXCIsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyc2VJbnQoc3Rkb3V0KSA+IDApIHtcblxuICAgICAgICAgICAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhcInVtbW91bnQgXCIgKyBkaXIsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoXCJub3QgbW91bnRlZFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cblxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdW50KHBhcnQ6IHN0cmluZywgbW9kZTogc3RyaW5nLCBvdGhlcm9wdGlvbnM/OiBzdHJpbmdbXSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IHBhcnRpOiBJUGFydGl0aW9uO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGFydGkgPSBjaGVja3BhcnQocGFydClcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICB9XG4gICAgICAgIGxldCBjbWQgPSBcIm1vdW50IFwiICsgcGFydGkucGFydGl0aW9uICsgXCIgLW8gcmVtb3VudCxcIiArIG1vZGVcbiAgICAgICAgXG4gICAgICAgIGlmIChvdGhlcm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNtZCArICcsJyArIG90aGVyb3B0aW9uc1xuICAgICAgICB9XG5cblxuICAgICAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoXCJjYXQgL2V0Yy9tdGFiIHwgZ3JlcCAtYyAnXCIgKyBwYXJ0ICsgXCInXCIsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyc2VJbnQoc3Rkb3V0KSA+IDApIHtcblxuICAgICAgICAgICAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjbWQsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoXCJub3QgbW91bnRlZFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfSlcblxuXG5cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHBhcnRpdGlvbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKHBhcnQpIHtcblxuICAgICAgICBsZXQgc2hvcnRwYXJ0OiBzdHJpbmc7XG4gICAgICAgIGxldCBleHRwYXJ0OiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgZGlza3MgPSBsc2Rpc2tzLmFsbCgpXG5cblxuICAgICAgICBpZiAocGFydC5zcGxpdCgnLycpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGV4dHBhcnQgPSBwYXJ0O1xuICAgICAgICAgICAgc2hvcnRwYXJ0ID0gcGFydC5zcGxpdCgnLycpW3BhcnQuc3BsaXQoJy8nKS5sZW5ndGggLSAxXVxuICAgICAgICB9IGVsc2Uge1xuXG5cblxuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG5cblxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
