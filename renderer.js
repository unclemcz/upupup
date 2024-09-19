/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */


const petselect = document.getElementById('pet-select')
const frequencyselect = document.getElementById('frequency-select') 

//切换动画
petselect.addEventListener('change', function(event) {  
    let pet = event.target.value; // 获取选中选项的值  
    console.log('Selected option value:', pet);  
    window.electronAPI.changeAnimal(pet);
});  
  
  //切换时间频率
frequencyselect.addEventListener('change', function(event) {  
    let frequency = event.target.value; // 获取选中选项的值   
    console.log('Selected model value:', frequency);  
    window.electronAPI.changeFrequency(frequency);
});  

//填充版本信息
const appversion = document.getElementById('app-version');
window.electronAPI.onVersion((value) => {
  appversion.innerText = value;
})