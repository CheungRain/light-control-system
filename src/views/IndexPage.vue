<template>
  <div class="container">
    <el-button class="audio-button" @click="RecordAudio">语音识别{{countAudioTime}}秒</el-button>
    <div v-for="light in lights" :key="light.id" class="light">
      <div :class="{'light-wrapper-on': light.isOn, 'light-wrapper-off': !light.isOn}">
        <div class="light-status" @click="light.showTimerDialog = true">
          <div :class="{'light-name-on': light.isOn, 'light-name-off': !light.isOn}">{{ light.name }}</div>
          <div :class="{'on': light.isOn, 'off': !light.isOn}">
            {{ light.isOn ? '已开启' : '已关闭' }}
          </div>
        </div>
        <div class="light-switch">
          <el-switch
              v-model="light.isOn"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChange(light)">
          </el-switch>
        </div>
        <div class="light-timer-countdown" @click="light.showTimerDialog = true">
          <el-text class="light-timer-countdown-on" v-if="light.timerStatus===true && light.isTimerOnOff===1">
            还有{{light.timerTimeCopy}}秒开启
          </el-text>
          <el-text class="light-timer-countdown-off" v-else-if="light.timerStatus===true && light.isTimerOnOff===0">
            还有{{light.timerTimeCopy}}秒关闭
          </el-text>
          <el-text v-else>
            <br>
          </el-text>
        </div>
      </div>
      <el-dialog class="dialog mobile-dialog"
                 v-model="light.showTimerDialog"
                 title="设置定时"
                 @close="light.showTimerDialog = false">
        <el-form>
          <el-form-item label="定时开关">
            <el-select
                class="select light-timer-select"
                v-model="light.isTimerOnOff"
                placeholder="请选择">
              <el-option
                  v-for="item in onOff"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="定时时间">
            <el-select
                class="select light-timer-select"
                v-model="light.timerTime"
                placeholder="请选择">
              <el-option
                  v-for="item in timerChoices"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button class="button light-timer-confirm-button" @click="confirmTime(light)">确认</el-button>
          <el-button class="button light-timer-cancel-button" @click="cancelTime(light)">取消</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { ElSwitch, ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElMessage } from 'element-plus';
import axios from "axios";
import Recorder from "js-audio-recorder";
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const micVolume = ref(0);
let audio = false;

const detectVolume = () => {
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for(let i = 0; i < bufferLength; i++){
    sum += dataArray[i];
  }
  const volume = sum / bufferLength;
  micVolume.value = volume;

  if(volume>50 && audio==true){
    RecordAudio();
  }
  requestAnimationFrame(detectVolume);
}
onMounted(() => {
  //detectVolume()
  navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        //detectVolume();
      })
      .catch(err => {
        console.error('Error getting user media:', err);
      });
});
ElMessage.success('欢迎登录');

const lights = ref([
  {
    id: 1,//灯的id号
    name: '灯1',//灯的名称
    isOn: 0,//灯的当前开关状态0是关1是开
    isTimerOnOff: null,//灯的定时状态
    timerTime: null,//灯的定时时间
    timerTimeCopy: null,//灯定时时间的拷贝用于显示定时倒计时
    timerStatus: false,//灯的定时状态
    showTimerDialog: false,//灯定时对话框的弹出
    timerInterval: null//灯定时倒计时器
  },
  {
    id: 2,
    name: '灯2',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false,
    timerInterval: null
  },
  {
    id: 3,
    name: '灯3',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false,
    timerInterval: null
  },
  {
    id: 4,
    name: '灯4',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false,
    timerInterval: null
  },
  {
    id: 5,
    name: '灯5',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false,
    timerInterval: null
  }
]);

const timerChoices = ref([
  {
    label: '10秒',
    value: 10
  },
  {
    label: '20秒',
    value: 20
  },
  {
    label: '30秒',
    value: 30
  },
  {
    label: '40秒',
    value: 40
  },
  {
    label: '50秒',
    value: 50
  },
  {
    label: '60秒',
    value: 60
  }
]);

const onOff = ref([
  {
    label: '定时开',
    value: 1
  },
  {
    label: '定时关',
    value: 0
  }
]);

let countAudio;
let countAudioTime = ref(3);

const blobToBase64 = (blob, callback) => {
  const reader = new FileReader();
  reader.onload = (result) => {
    const base64String = btoa(
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
  clearInterval(countAudio);
  audio = true;
  ElMessage.success('开始识别')
  // console.log("开始录音")
  recorder.start()
  countAudio = setInterval(()=>{
    if(countAudioTime.value>1){
      countAudioTime.value--;
    }else{
      countAudioTime.value=3
    }
  },1250);
  setTimeout(()=>{
    ElMessage.warning('停止识别')
    // console.log("停止录音");
    clearInterval(countAudio);
    const pcmBlob = recorder.getPCMBlob();
    const pcmBlob_len = pcmBlob.size;
    blobToBase64(pcmBlob, (base64String) => {
      const base64 = base64String;
      const token = '24.19950bee43802d550f29b4d12c5015e3.2592000.1702287353.282335-42750245'
      const format = 'pcm';
      const rate = 16000;
      const channel = 1;
      const cuid = '5Bg3dVi0WNfWISubL00qxugrCQX5q5NN';
      const dev_pid =  1537;
      const speech = base64;
      const len = pcmBlob_len;
      const url = 'api0/server_api'
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
        const audio_string = response.data.result[0].replace(/[^\u4e00-\u9fa5]/g, '');
        console.log(audio_string)
        //ElMessage.warning(audio_string)
        if(audio_string.includes('取') || audio_string.includes('消')){
          if(audio_string.includes('一')){
            cancelTime(lights.value[0]);
          }
          if(audio_string.includes('二')){
            cancelTime(lights.value[1]);
          }
          if(audio_string.includes('三')){
            cancelTime(lights.value[2]);
          }
          if(audio_string.includes('四')){
            cancelTime(lights.value[3]);
          }
          if(audio_string.includes('五')){
            cancelTime(lights.value[4]);
          }
        }else if(audio_string.includes('定') || audio_string.includes('时')){
          if(audio_string.includes('开')){
            if(audio_string.includes('一')){
              lights.value[0].timerStatus = true;
              lights.value[0].timerTime = 30;
              lights.value[0].isTimerOnOff = 1;
              confirmTime(lights.value[0]);
            }
            if(audio_string.includes('二')){
              lights.value[1].timerStatus = true;
              lights.value[1].timerTime = 30;
              lights.value[1].isTimerOnOff = 1;
              confirmTime(lights.value[1]);
            }
            if(audio_string.includes('三')){
              lights.value[2].timerStatus = true;
              lights.value[2].timerTime = 30;
              lights.value[2].isTimerOnOff = 1;
              confirmTime(lights.value[2]);
            }
            if(audio_string.includes('四')){
              lights.value[3].timerStatus = true;
              lights.value[3].timerTime = 30;
              lights.value[3].isTimerOnOff = 1;
              confirmTime(lights.value[3]);
            }
            if(audio_string.includes('五')){
              lights.value[4].timerStatus = true;
              lights.value[4].timerTime = 30;
              lights.value[4].isTimerOnOff = 1;
              confirmTime(lights.value[4]);
            }
          }else if(audio_string.includes('关')){
            if(audio_string.includes('一')){
              lights.value[0].timerStatus = true;
              lights.value[0].timerTime = 30;
              lights.value[0].isTimerOnOff = 0;
              confirmTime(lights.value[0]);
            }
            if(audio_string.includes('二')){
              lights.value[1].timerStatus = true;
              lights.value[1].timerTime = 30;
              lights.value[1].isTimerOnOff = 0;
              confirmTime(lights.value[1]);
            }
            if(audio_string.includes('三')){
              lights.value[2].timerStatus = true;
              lights.value[2].timerTime = 30;
              lights.value[2].isTimerOnOff = 0;
              confirmTime(lights.value[2]);
            }
            if(audio_string.includes('四')){
              lights.value[3].timerStatus = true;
              lights.value[3].timerTime = 30;
              lights.value[3].isTimerOnOff = 0;
              confirmTime(lights.value[3]);
            }
            if(audio_string.includes('五')){
              lights.value[4].timerStatus = true;
              lights.value[4].timerTime = 30;
              lights.value[4].isTimerOnOff = 0;
              confirmTime(lights.value[4]);
            }
          }
        }else if(audio_string.includes('打') || audio_string.includes('开')){
          if(audio_string.includes('一')){
            lights.value[0].isOn = 1;
            switchChange(lights.value[0]);
          }
          if(audio_string.includes('二')){
            lights.value[1].isOn = 1;
            switchChange(lights.value[1]);
          }
          if(audio_string.includes('三')){
            lights.value[2].isOn = 1;
            switchChange(lights.value[2]);
          }
          if(audio_string.includes('四')){
            lights.value[3].isOn = 1;
            switchChange(lights.value[3]);
          }
          if(audio_string.includes('五')){
            lights.value[4].isOn = 1;
            switchChange(lights.value[4]);
          }
        }else if(audio_string.includes('关') || audio_string.includes('闭')){
          if(audio_string.includes('一')){
            lights.value[0].isOn = 0;
            switchChange(lights.value[0]);
          }
          if(audio_string.includes('二')){
            lights.value[1].isOn = 0;
            switchChange(lights.value[1]);
          }
          if(audio_string.includes('三')){
            lights.value[2].isOn = 0;
            switchChange(lights.value[2]);
          }
          if(audio_string.includes('四')){
            lights.value[3].isOn = 0;
            switchChange(lights.value[3]);
          }
          if(audio_string.includes('五')){
            lights.value[4].isOn = 0;
            switchChange(lights.value[4]);
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    });
    audio = false;
  },3900);
};


const switchChange = (light) => {
  // const url = 'api'+light.id.toString()+'/led_'+light.id.toString()
  // const data = {
  //   button: light.isOn
  // };
  // const config = {
  //   params: data
  // }
  // axios.post(url, data, config).then(response => {
  //   console.log(response.data)
  // })
}

const cancelTime = (light) =>{
  if(light.timerStatus) {
    // const url = ""
    // const data = {
    //
    // };
    // const config = {
    //   params: data
    // }
    // axios.post(url, data, config).then(response => {
    //   console.log(response.data)
    // })
    clearInterval(light.timerInterval);
    light.isTimerOnOff = null;
    light.timerTime = null;
    light.timerStatus = false;
    ElMessage.success(light.name.toString() + "取消定时成功");
  }else{
    ElMessage.error(light.name.toString()+"还没有设置定时")
  }
  light.showTimerDialog = false;
};

const confirmTime = (light) => {
  if (light.isTimerOnOff !== null && light.timerTime !== null) {
    // const url = ""
    // const data = {
    //
    // };
    // const config = {
    //   params: data
    // }
    // axios.post(url, data, config).then(response => {
    //   console.log(response.data)
    // })
    ElMessage.success(light.name.toString()+"定时成功")
    light.showTimerDialog = false;
    light.timerStatus = true;
    light.timerTimeCopy = light.timerTime;
    clearInterval(light.timerInterval);
    light.timerInterval = setInterval(() => {
      if (light.timerTimeCopy > 1) {
        light.timerTimeCopy--;
      } else {
        clearInterval(light.timerInterval);
        ElMessage.success(light.name.toString()+"定时时间到了")
        light.timerStatus = false;
        light.isOn = light.isTimerOnOff;
      }
    }, 1000);
  }else{
    ElMessage.error("请选择定时开关和定时时间")
  }
};




</script>

<style>

body {
  margin: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.light {
  width: 300px;
  height: 125px;
  margin-bottom: 20px;
}

.light-wrapper-on {
  border: 1px solid rgb(19, 206, 102);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 0px 4px rgb(19, 206, 102);
  background: rgba(255, 255, 255, 0.9);
}

.light-wrapper-off {
  border: 1px solid rgb(255, 73, 73);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 0px 1px rgb(255, 73, 73);
  background: rgba(255, 255, 255, 0.9);
}

.light-status{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.light-name-on{
  color: rgb(19, 206, 102);
}

.light-name-off{
  color: rgb(255, 73, 73);
}

.on{
  color: rgb(19, 206, 102);
}

.off{
  color: rgb(255, 73, 73);
}

.light-switch {
  margin-bottom: 10px;
}

.dialog {
  border-radius: 15px;
  box-shadow: 0px 0px 8px rgba(245, 212, 7, 0.3);
  background: rgba(255, 255, 255, 0.88);
  width: 250px;
}

.dialog::before {
  content: "";
  background: inherit;
  filter: blur(20px) brightness(0.7);
  position: absolute;
  top: -10px;
  bottom: -10px;
  right: -10px;
  left: -10px;
  z-index: -1;
  border-radius: inherit;
  width: 250px;
}

.mobile-dialog {
  padding: 14px 20px !important;
}

.light-timer-select {
  width: 100%;
}

.audio-button{
  margin-top: 10px;
  margin-bottom: 10px;
  width: 270px;
  border-radius: 8px;
  background:inherit;
  border: none;
  color: #ffffff;
}

.light-timer-confirm-button {
  margin-top: 20px;
  background-color: rgb(19, 206, 102);
  border: none;
  color: white;
}

.light-timer-cancel-button {
  margin-top: 20px;
  background-color: rgb(255, 73, 73);
  border: none;
  color: white;
}
.light-timer-countdown-on{
  color: rgb(19, 206, 102);
}

.light-timer-countdown-off{
  color: rgb(255, 73, 73);
}


</style>