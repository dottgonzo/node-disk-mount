import * as Promise from "bluebird";
import * as lsdisks from "ls-disks";
import * as child_process from "child_process";




function checkpart(part: string): Promise<lsdisks.IPartition> {
  return new Promise<lsdisks.IPartition>((resolve, reject) => {

    const partitions = lsdisks.listPartitions();

    let thepartition: lsdisks.IPartition;
    let exists = false;
    for (let p = 0; p < partitions.length; p++) {
      if (partitions[p].name === part || partitions[p].partition === part || partitions[p].label === part) {
        thepartition = partitions[p]
        exists = true
      }
    }

    if (exists) {
      resolve(thepartition)
    } else {
      reject("partition " + part + " not founded")
    }
  })
}

export function mount(part: string, dir: string): Promise<true> {
  // manca il controllo del se già è montato
  // sarebbe in oltre possibile montare la partizione senza specificare la directory qualora la partizione esiste sull'fstab
  return new Promise<true>((resolve, reject) => {

    checkpart(part).then((parti) => {
      child_process.exec("sudo mount " + parti.partition + " " + dir, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    }).catch((err) => {
      reject(err)
    })




  })

}

export function umount(dirOrPart: string): Promise<true> {
  // il controllo del mountpoint è impreciso

  return new Promise<true>((resolve, reject) => {


    child_process.exec("cat /etc/mtab | grep -c '" + dirOrPart + "'", (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else if (parseInt(stdout) > 0) {

        child_process.exec("sudo umount " + dirOrPart, (err, stdout, stderr) => {
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


export function remount(part: string, mode: string, otheroptions?: string[]): Promise<true> {

  return new Promise<true>((resolve, reject) => {
    checkpart(part).then((parti) => {

      let cmd = "sudo mount " + parti.partition + " -o remount," + mode

      if (otheroptions) {
        cmd + ',' + otheroptions
      }


      child_process.exec("cat /etc/mtab | grep -c '" + parti.partition + "'", (err, stdout, stderr) => {
        if (err) {
          reject('not founded, or disk error')
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
    }).catch((err) => {
      reject(err)
    })

  })


}




