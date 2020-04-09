//TODO: implement samples, chances are i won't

let modParser; //global variable that conatins the lirary

//wrap everything in a scope
{
  //taken from https://www.quaxio.com/%C2%B5_mod_player_from_scratch/
  let MK_to_channels = {
    "2CHN": 2,
    "M.K.": 4,
    "M!K!": 4,
    "4CHN": 4,
    "FLT4": 4,
    "6CHN": 6,
    "8CHN": 8,
    "OKTA": 8,
    "CD81": 8
  }

  let periods = {
    856: "C1", 808: "C#1", 762: "D1", 720: "D#1", 678: "E1", 640: "F1", 
    604: "F#1", 570: "G1", 538: "G#1", 508: "A1", 480: "A#1", 453: "B1",
    428: "C2", 404: "C#2", 381: "D2", 360: "D#2", 339: "E2", 320: "F2", 
    302: "F#2", 285: "G2", 269: "G#2", 254: "A2", 240: "A#2", 226: "B2",
    214: "C3", 202: "C#3", 190: "D3", 180: "D#3", 170: "E3", 160: "F3", 
    151: "F#3", 143: "G3", 135: "G#3", 127: "A3", 120: "A#3", 113: "B3"
  }


  function getMax(arr) {
    let max = -Infinity
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }

    return max;
  }

  function getTrimmedLength(arr) {
    let lastValue = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        lastValue = i;
      }
    }

    return lastValue;
  }

  modParser = new class {
    parseString(source) {
      let mod = new Mod();
      let reader = new Reader(source);
      mod.name = reader.read(20);

      //read M.K. Byte to get channels
      reader.seek(1080);
      let MK = reader.read(4);

      let channelsLength = MK_to_channels[MK] ? MK_to_channels[MK] : 4;
      let samplesLength = MK_to_channels[MK] ? 31 : 15;

      reader.seek(20);

      //read sample data
      for (let i = 0; i < samplesLength; i++) {
        mod.samples[i] = {};
        mod.samples[i].name = reader.read(22);
        mod.samples[i].sampleLength = reader.readByteNum() << 8 +
          reader.readByteNum();
        mod.samples[i].nibble = reader.readByteNum();
        mod.samples[i].volume = reader.readByteNum();
        mod.samples[i].repeatStart = reader.readByteNum() << 8 +
          reader.readByteNum();
        mod.samples[i].repeatLength = reader.readByteNum() << 8 +
          reader.readByteNum();
      }

      //amount of patterns to be played
      let songLength = reader.readByteNum();

      //useless byte, usually set to 127
      reader.readByteNum();

      //read pattern order
      mod.patternOrder = []
      for (let i = 0; i < 128; i++) {
        if (i < songLength)
          mod.patternOrder[i] = reader.readByteNum();
        else
          reader.readByteNum();
      }

      //skip M.K. byte
      reader.read(4)

      //loop through patterns
      for (let pattern = 0; pattern < getMax(mod.patternOrder); pattern++) {
        mod.patterns[pattern] = []
        let lastPosition = 0;

        //loop through pattern position
        for (let position = 0; position < 64; position++) {
          mod.patterns[pattern][position] = []

          //loop through channels
          for (let channel = 0; channel < channelsLength; channel++) {
            let byte1 = reader.readByteNum()
            let byte2 = reader.readByteNum()
            let byte3 = reader.readByteNum()
            let byte4 = reader.readByteNum()

            mod.patterns[pattern][position][channel] = {
              periodNum: ((byte1 & 0x0F) << 8) | byte2,
              effect: ((byte3 & 0x0F) << 8) | byte4,
              sample: (byte1 & 0xF0) | ((byte3 & 0xF0) >> 4)
            };

            let period = periods[((byte1 & 0x0F) << 8) | byte2];
            mod.patterns[pattern][position][channel].period = period; 

            //save last non zero position
            if (mod.patterns[pattern][position][channel].period) {
              lastPosition = position + 1;
            }
          }
        }
        //set length to last non zero position
        mod.patterns[pattern].length = lastPosition;
      }  //  end loop through patterns

      return mod;
    }

    async parseFile(file) {
      let reader = new FileReader();
      let source = reader.readAsBinaryString(file);
    }
  }

  class Mod {
    constructor() {
      this.name;
      this.channels;
      this.samples = []
      this.patterns = []
    }
  }

  //class to easily read strings byte by byte.
  class Reader {
    constructor(string) {
      this.index = 0;
      this.string = string;
    }

    read(bytes) {
      let ret = this.string.slice(this.index, this.index + bytes);
      this.index += bytes;
      return ret;
    }

    readByteNum() {
      let ret = this.string.charCodeAt(this.index);
      this.index++;
      return ret;
    }

    seek(bytes) {
      this.index = bytes
    }
  }
}