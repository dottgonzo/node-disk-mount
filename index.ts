import * as Promise from "bluebird";
import * as lsdisks from "ls-disks";
import * as child_process from "child_process";

// deve funzionare anche con etichetta

function cleanpart(part: string): string {
    if (part.split('/').length > 1) {
        part = part.split('/')[part.split('/').length - 1]
    }

    return part
}


function extendedpart(part: string): string | boolean {
    const shortpart = cleanpart(part)
    let exsists = false
    let partition
    const d = lsdisks.all();


    for (let i = 0; i < d.length; i++) {
        for (let p = 0; p < d[i].partitions.length; p++) {
            const pa = cleanpart(d[i].partitions[p].partition)
            if (pa === shortpart) {
                partition = pa
                exsists = true
            }
        }
    }
    if (exsists) {
        return partition
    } else {
        console.log("not exists!")
        return false

    }

}

function checkpart(part: string): boolean {
    let exsists = false
    const shortpart = cleanpart(part)

    const d = lsdisks.all();

    for (let i = 0; i < d.length; i++) {
        for (let p = 0; p < d[i].partitions.length; p++) {
            const pa = cleanpart(d[i].partitions[p].partition)
            if (pa === shortpart) {
                exsists = true
            }

        }


    }

    return exsists
}

export function mount(part: string, dir: string): Promise<boolean> {
    // manca il controllo del se già è montato
    return new Promise<boolean>((resolve, reject) => {
        if (checkpart(part)) {
            const shortpart = cleanpart(part);
            const extpart = extendedpart(shortpart);

            child_process.exec("mount " + extpart + " " + dir, (err, stdout, stderr) => {
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
        if (checkpart(part)) {
            const extpart = extendedpart(part);

            child_process.exec("cat /etc/mtab | grep -c '" + part + "'", (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else if (parseInt(stdout) > 0) {

                    child_process.exec("mount " + extpart + " -o remount," + mode, (err, stdout, stderr) => {
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
        }
    })



}