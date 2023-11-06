import {API_KEY} from './env.js';
/* 현재날씨 api */

const getCurrentWeather  = (latitude,longitude) => {
  /* api요청하기 */
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

fetch(URL)
.then((response) => response.json())
.then((data)=>{
  console.log(data)
  const city = document.querySelector('.city');
  const weather = document.querySelector('.weather');
  const temp = document.querySelector('.temp');
  const icon = document.querySelector('.icon')

  city.innerText =data.name;
  weather.innerText=data.weather[0].main;
  temp.innerText = `${data.main.temp}°C`;
  icon.src=`https://openweathermap.org/img/wn/${ data.weather[0].icon}@2x.png`;
  
});
};


//latitude(위도), longitude(경도)
/* 팝업창을 허용했을때 */
const getPostion = (position)=>{
  const{latitude,longitude} =position.coords;
  getCurrentWeather(latitude,longitude);
};

/* 팝업창을 차단했을때 만들어둔 메세지 띄우기 */
const errorHandler =(error) => {
  console.log(error.message);//차단을 클릭하면 에러메세지가 뜸
const noti = document.querySelector('.noti');
noti.style.display ='block';
};

if("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(getPostion,errorHandler);
  //현재위치를 가져오는게 성공하면 실행되는 콜백함수,에러가 발생했을때 실행하는 콜백함수
}else{
  console.log('geolocatioln IS NOT availble');
};


/* 오늘의 날짜 */
$(document).ready(function () {
  let objDate = new Date();
  let month=objDate.getMonth(); //월구하기 ->0(1월)부터 11(12월)까지의 정수값
  let date=objDate.getDate();//일구하기->날짜(일)를 나타내는 1에서 31까지의 정수
  let day=objDate.getDay(); // 0(일)부터 6(토)까지의 정수값
  let aryDay = ['일','월','화','수','목','금','토'];
  
  //년, 월, 일, 요일 출력
  let fulldate=`${month+1}월${date}일(${aryDay[day]})`;
  $('#date').text(fulldate);
});

/*현재 시간 */

const hour = document.querySelector('.hour');
const min = document.querySelector('.min');

function addZero(value){
  if(value < 10 ){
    value = '0' + value; 
  }
  return value;
}

function clock(){
  const now = new Date();
  hour.innerText = addZero(now.getHours());
  min.innerText = addZero(now.getMinutes());
}

setInterval(clock, 1000);

/* to do list  */
const form =document.querySelector('form');
const input =document.querySelector('input');
const ul = document.querySelector('ul');
const todoCount = document.querySelector('.todo-count'); 
const clearAll = document.querySelector('.clear-all'); 

let todos = []; 

const save = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoCount = () => {
  todoCount.textContent = todos.length;
};

const clearItems = () => {
  ul.innerHTML = '';
  todos = [];
  localStorage.removeItem('todos');
  updateTodoCount();
};

const delItem = (event) => {
  const target = event.target.parentElement;

  todos = todos.filter((todo) => todo.id !== parseInt(target.id));

  save();
  target.remove();  
  updateTodoCount(); 
};

const addItem = (todo) => {  
  const divtag = document.createElement('input');
    const li = document.createElement('li'); 
    const span =document.createElement('span');
    const icon = document.createElement('i');



    icon.classList.add('fa-solid','fa-trash-can');
    span.innerText = todo.text;
    icon.addEventListener('click',delItem);
    divtag.addEventListener('click',divtag)

    ul.appendChild(li);
    li.appendChild(divtag);
    li.appendChild(span);
    li.appendChild(icon);

    li.id = todo.id; 

    divtag.type='checkbox';
    divtag.addEventListener("change",()=>{
      if(divtag.checked ===true){
        span.style.color ="#dddddd";
      }else{
        span.style.color="#ffffff";
      }
      });

      updateTodoCount(); 
};

const handler = (event) => {
  event.preventDefault();
  
  const todo = {
    id: Date.now(),
    text: input.value,
  };

  if((input.value) !== '') {  
    todos.push(todo);
    addItem(todo);  
    save();
    input.value = '';
  }
  
};

const init = () => {
  const userTodos = JSON.parse(localStorage.getItem('todos'));

  if (userTodos) {
    userTodos.forEach((todo) => {
      addItem(todo);
    });
    todos = userTodos; 
  }

  updateTodoCount();
};

init();
form.addEventListener('submit',handler);
clearAll.addEventListener('click', clearItems);

