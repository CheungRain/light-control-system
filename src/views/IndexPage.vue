<template >
  <div class="container">
    <div v-for="light in lights" :key="light.id" class="light">
      <div class="light-info">灯{{ light.id }}</div>
      <el-switch
          v-model="light.isOn"
          :active-value="1"
          :inactive-value="0"
          active-text="开启"
          inactive-text="关闭"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeStatus(light.id)">
      </el-switch>
      <br/>
      <el-select
          v-model="light.status"
          class="table1"
          placeholder="选择状态"
          @change="changeOnTime(light.id)">
        <el-option
            v-for="item in statuss"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
<!--      <el-button @click="cancelOnTime(light.id)">取消定时开</el-button>-->
      <el-select
          class="table2"
          v-model="light.offTime"
          placeholder="选择时间"
          @change="changeOffTime(light.id)">
        <el-option
            v-for="item in seconds"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
<!--      <el-button @click="cancelOffTime(light.id)">取消定时关</el-button>-->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";

const lights = ref([
  { id: 1, isOn: 0, onTime:null, offTime:null,status:null },
  { id: 2, isOn: 0, onTime:null, offTime:null,status:null },
  { id: 3, isOn: 0, onTime:null, offTime:null,status:null },
  { id: 4, isOn: 0, onTime:null, offTime:null,status:null },
  { id: 5, isOn: 0, onTime:null, offTime:null,status:null },
]);
const statuss = ref([
    "on","off"
])
const seconds = ref([
   10,20,30
])
const changeStatus = (id) => {
  const light = lights.value[id - 1];
  // console.log(light)
  const url = 'api'+id.toString()+'/led_'+id.toString()
  const data = {
    // id: light.id,
    button: light.isOn
  };
  const config = {
    params: data
  }
  axios.post(url, data, config).then(response => {
    console.log(response.data)
  })
}
const changeOnTime = (id) => {
  const light = lights.value[id - 1];
  console.log(light)
  // const url = '/time'
  // const data = {
  //   s: light.onTime,
  //   state: 0
  // };
  // const config = {
  //   params: data
  // }
  // axios.post(url, data, config).then(response => {
  //   console.log(response.data)
  // })
}
const cancelOnTime = (id) => {
  const light = lights.value[id - 1];
  light.onTime = null;
}
const changeOffTime = (id) => {
  const light = lights.value[id - 1];
  console.log(light)
  // const url = '/time'
  // const data = {
  //   s: light.offTime,
  //   state: 1
  // };
  // const config = {
  //   params: data
  // }
  // axios.post(url, data, config).then(response => {
  //   console.log(response.data)
  // })
}
const cancelOffTime = (id) => {
  const light = lights.value[id - 1];
  light.offTime = null;
}
</script>


<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  margin: auto;
}

.light {
  display: flex;
  align-items: center;
  margin: 10px;
}

.light-info {
  margin-right: 10px;
}

.table1{
  width: 115px;
}

.table2{
  width: 115px;
}
</style>
