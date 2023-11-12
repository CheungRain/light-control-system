<template>
  <div>
    <el-button type="button" @click="RecordAudio">语音控制</el-button>

  </div>
</template>

<script setup>
import Recorder from "js-audio-recorder";
import axios from "axios";

const blobToBase64 = (blob, callback) => {
  const reader = new FileReader();
  reader.onload = function (result) {
    const base64String = window.btoa(
        String.fromCharCode(...new Uint8Array(result.target.result))
    );
    callback(base64String);
  };
  reader.readAsArrayBuffer(blob);
};

const recorder = new Recorder({
  sampleBits: 16,
  sampleRate: 16000,
  numChannels: 1,
});

const RecordAudio = () => {
  console.log("开始录音")
  recorder.start()
  setTimeout(()=>{
    console.log("停止录音");
    const file = recorder.getPCMBlob();
    const file_len = file.size;
    blobToBase64(file, (base64String) => {
      const base64 = base64String;
      const token = '24.19950bee43802d550f29b4d12c5015e3.2592000.1702287353.282335-42750245'
      const format = 'pcm';
      const rate = 16000;
      const channel = 1;
      const cuid = '5Bg3dVi0WNfWISubL00qxugrCQX5q5NN';
      const dev_pid =  1537;
      const speech = base64;
      const len = file_len;
      const url = '/api0/server_api'
      const data = {
        token: token,
        format: format,
        rate: rate,
        channel: channel,
        cuid: cuid,
        dev_pid: dev_pid,
        speech: speech,
        len: len
      };
      const config = {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }
      axios.post(url, data, config).then(response => {
        console.log(response.data.result[0])
      })
    });
  },3000);
};


</script>

<style scoped lang="scss">
</style>