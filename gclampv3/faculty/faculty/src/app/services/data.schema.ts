export class KeyImage {
  defaultimg: string = '';
  defaultMessage: string = 'AvengersRockzWithZontheRocks';
  generateHexString(len) {
    const hex = '0123456789abcdef';
    let output = '';
    for (let i = 0; i < len; ++i) {
      output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
  }

  generateASCIIString(len) {
    const hex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let output = '';
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
  }
}

export class Haystack {
  generateString(len) {
    const vString = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let output = '';
    for (let i = 0; i < len; ++i) {
      output += vString.charAt(Math.floor(Math.random() * vString.length));
    }
    return output;
  }
}




export class getRecipients {
  memberMap(array: []) {
    let r: any = [];
    array.map((e: any) => {
      r.push(e.studnum_fld);
    })
    return r;
  }
}

export class Activity {
  typefield: number;
  recipient_fld: number;
  topiccode_fld: number;
  title_fld: string;
  desc_fld: string = '';
  totalscore_fld: number = 0;
  classcode_fld: number;
  deadline_fld: any;
  filedir_fld: string;
}

export class Classroom {
  classcode: number;
  desc_fld: string;
  block_fld: string;
}

export class AppConfig{
  baseURL: string;
  downloadURL: string
  imgURL: string
  prefix: string
}
