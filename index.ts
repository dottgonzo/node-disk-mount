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

    const partitions = lsdisks.all();

    let thepartition: IPartition;
    let exists = false;
    for (let p = 0; p < partitions.length; p++) {
        if (partition[p].name === part || partition[p].partition === part || partition[p].label === part) {
            thepartition = partition[p]
            exists = true
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
    return new Promise<boolean>((resolve, reject) => {
        let parti: IPartition;
        try {
            parti = checkpart(part)
        } catch (err) {
            reject(err)
        }

        if (checkpart(part)) {
            child_process.exec("mount " + parti.partition + " " + dir, (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        } else {
            reject("not present")
        }

    })

}
export function umount(dir: string): Promise<boolean> {
    // il controllo del mountpoint è impreciso

    return new Promise<boolean>((resolve, reject) => {

        child_process.exec("cat /etc/mtab | grep -c '" + dir + "'", (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else if (parseInt(stdout) > 0) {

                child_process.exec("ummount " + dir, (err, stdout, stderr) => {
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



export default class partition {


    constructor(part) {

        let shortpart: string;
        let extpart: string;

        const disks = lsdisks.all()


        if (part.split('/').length > 1) {
            extpart = part;
            shortpart = part.split('/')[part.split('/').length - 1]
        } else {




        }


    }



}