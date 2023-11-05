<template>
  <div class="container">
    <div v-for="light in lights" :key="light.id" class="light">
      <div class="light-wrapper" >
        <div class="light-status">
          <div>{{ light.name }}</div>
          <div>{{ light.isOn ? '已开启' : '已关闭' }}</div>
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
          <el-text v-if="light.timerStatus===true && light.isTimerOnOff===1">
            还有{{light.timerTimeCopy}}秒开启
          </el-text>
          <el-text v-else-if="light.timerStatus===true && light.isTimerOnOff===0">
            还有{{light.timerTimeCopy}}秒关闭
          </el-text>
          <el-text v-else>
            <br>
          </el-text>
        </div>
      </div>
      <el-dialog
          class="dialog"
          v-model="light.showTimerDialog"
          title="设置定时"
          @close="light.showTimerDialog = false">
        <el-form>
          <el-form-item label="定时开关">
            <el-select
                class="select"
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
                class="select"
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
          <el-button class="button" @click="confirmTime(light)">确认</el-button>
          <el-button class="button" @click="cancelTime(light)">取消</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElSwitch, ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElMessage } from 'element-plus';
import axios from "axios";

ElMessage.success('欢迎登录');

const lights = ref([
  {
    id: 1,
    name: '灯1',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false
  },
  {
    id: 2,
    name: '灯2',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false
  },
  {
    id: 3,
    name: '灯3',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false
  },
  {
    id: 4,
    name: '灯4',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false
  },
  {
    id: 5,
    name: '灯5',
    isOn: 0,
    isTimerOnOff: null,
    timerTime: null,
    timerTimeCopy: null,
    timerStatus: false,
    showTimerDialog: false
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

let timerInterval;

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
    clearInterval(timerInterval);
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
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (light.timerTimeCopy > 1) {
        light.timerTimeCopy--;
      } else {
        clearInterval(timerInterval);
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
  background-color: #fff;
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

.light-wrapper {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 15px;
  background-color: #fff;
}

.light-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.light-switch {
  margin-bottom: 10px;
}

.dialog{
  background-size: auto;
  border-radius: 20px;
  width: 200px;
}

</style>