import * as Promise from "bluebird";
import * as lsdisks from "ls-disks";
import * as child_process from "child_process";


interface IPartition {
    partition: string;
    sectors: number;
    sectors_start: number;
    sectors_stop: number;
    type: string;
    boot: boolean;
    size: number;
    label?: string;
    name: string;
}


function checkpart(part: string): IPartition {

    const disks = lsdisks.all();

    let thepartition: IPartition;
    let exists = false;
    for (let d = 0; d < disks.length; d++) {
        for (let p = 0; p < disks[d].partitions.length; p++) {
            if (disks[d].partitions[p].name === part || disks[d].partitions[p].partition === part || disks[d].partitions[p].label === part) {
                thepartition = disks[d].partitions[p]
                exists = true
            }
        }
    }

    if (exists) {
        return thepartition
    } else {
        throw Error("partition " + part + " not founded")
    }

}

export function mount(part: string, dir: string): Promise<boolean> {
    // manca il controllo del se già è montato
    // sarebbe in oltre possibile montare la partizione senza specificare la directory qualora la partizione esiste sull'fstab
    return new Promise<boolean>((resolve, reject) => {
        let parti: IPartition;
        try {
            parti = checkpart(part)
        } catch (err) {
            reject(err)
        }

        child_process.exec("mount " + parti.partition + " " + dir, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })

    })

}

export function umount(dirOrPart: string): Promise<boolean> {
    // il controllo del mountpoint è impreciso

    return new Promise<boolean>((resolve, reject) => {


        child_process.exec("cat /etc/mtab | grep -c '" + dirOrPart + "'", (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else if (parseInt(stdout) > 0) {

                child_process.exec("ummount " + dirOrPart, (err, stdout, stderr) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            } else {
                reject("not mounted")
            }
        })
    })


}


export function remount(part: string, mode: string, otheroptions?: string[]): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
        let parti: IPartition;
        try {
            parti = checkpart(part)
        } catch (err) {
            reject(err)
        }
        let cmd = "mount " + parti.partition + " -o remount," + mode

        if (otheroptions) {
            cmd + ',' + otheroptions
        }


        child_process.exec("cat /etc/mtab | grep -c '" + part + "'", (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else if (parseInt(stdout) > 0) {

                child_process.exec(cmd, (err, stdout, stderr) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            } else {
                reject("not mounted")
            }
        })

    })


}




