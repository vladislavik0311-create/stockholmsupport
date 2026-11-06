const pages=["Главная","Задания","Статистика","Переаттестации","Таблицы","Мероприятия","Собрания","Документы","Колесо фортуны","Шар предсказаний","Администрация","Трекер заданий","Ивенты для вышки","Достижения"];
const icons=["⌂","✓","▥","♧","▦","▣","♙","▤","◉","✧","⚙","☷","♜","✦"];
const nav=document.getElementById("navigation"), content=document.getElementById("pageContent");
let current="Главная", currentUser=null;
pages.forEach((p,i)=>{const b=document.createElement("button");b.className="nav-link";b.innerHTML=`<span class="nav-icon">${icons[i]}</span>${p}`;b.addEventListener("click",()=>{render(p);closeMenu()});nav.appendChild(b)});
const menu=document.getElementById("sidebar"),scrim=document.getElementById("scrim"),menuBtn=document.getElementById("menuButton");
function openMenu(){menu.classList.add("open");scrim.classList.add("open");menu.setAttribute("aria-hidden","false");menuBtn.setAttribute("aria-expanded","true")}
function closeMenu(){menu.classList.remove("open");scrim.classList.remove("open");menu.setAttribute("aria-hidden","true");menuBtn.setAttribute("aria-expanded","false")}
menuBtn.onclick=openMenu;document.getElementById("closeMenu").onclick=closeMenu;scrim.onclick=closeMenu;
const taskData=[["Наборы","5 саппортов, 7 интервью","0 / 7","♧"],["Переаттестации","10 переаттестаций","0 / 10","✓"],["Актив-часть","3 мероприятия","0 / 3","✿"],["Вкач-локалка","2 часа проходки","0 / 2","⚒"]];
function heading(title,sub="Рабочее пространство Stockholm Support"){return `<div class="section-heading"><div><h2>${title}</h2><p>${sub}</p></div><span class="tag">✿ Jade Palace</span></div>`}
function tasks(){return `<div class="task-list">${taskData.map(t=>`<div class="task-row"><span class="task-icon">${t[3]}</span><div><b>${t[0]}</b><small>${t[1]}</small></div><span class="task-count">${t[2]}</span></div>`).join("")}</div>`}
function home(){return `${heading("Обзор команды","Основные показатели и состояние подветок")}<div class="grid">${[[currentUser?"—":"—","Саппортов","Данные появятся после входа"],["—","Вышка","Старший состав"],["—","Монет","Общий баланс"],["—","Подветок","Активные направления"]].map(x=>`<article class="metric"><div class="metric-label">${x[1]}</div><div class="metric-value">${x[0]}</div><div class="metric-foot">${x[2]}</div></article>`).join("")}</div><div class="two-col"><section class="panel"><h3>Задания недели</h3>${tasks()}</section><section class="panel"><h3>Состав вышки</h3><table class="table"><thead><tr><th>Отдел</th><th>Саппорты</th><th>Статус</th></tr></thead><tbody><tr><td>Наборы</td><td>—</td><td><span class="tag">В базе</span></td></tr><tr><td>Переаттестации</td><td>—</td><td><span class="tag">В базе</span></td></tr><tr><td>Актив-часть</td><td>—</td><td><span class="tag warn">В процессе</span></td></tr><tr><td>Вкач-локалка</td><td>—</td><td><span class="tag">В базе</span></td></tr></tbody></table></section></div><div class="two-col"><section class="panel"><h3>Объявление</h3><p style="color:#c8dfcf;font-size:13px;line-height:1.7">Не забывайте выполнять еженедельные задания! Вместе мы сильнее ♡</p></section><section class="panel"><h3>Ближайшие события</h3><div class="task-row"><span class="task-icon">✿</span><div><b>События появятся здесь</b><small>После добавления в базу данных</small></div><span class="tag">Скоро</span></div></section></div>`}
const pageDetails={"Задания":["Задания подветок","Здесь будут задания назначенной подветки."],"Статистика":["Статистика команды","Показатели активности и эффективности участников."],"Переаттестации":["История переаттестаций","Планирование каждые 7 дней и повторная попытка через 3 дня после неудачи."],"Таблицы":["Рабочие таблицы","Учет смен, часов, выговоров и заработной платы."],"Мероприятия":["Календарь мероприятий","Планируйте события и добавляйте участников."],"Собрания":["Собрания команды","Повестка, дата, участники и история."],"Документы":["База документов","Общая информация и материалы отдельных подветок."],"Колесо фортуны":["Колесо фортуны","Сектора, подписи и вероятность выпадения."],"Шар предсказаний":["Шар предсказаний","Задайте вопрос и получите случайный ответ."],"Администрация":["Панель администрации","Журнал действий, роли, подветки и оформление."],"Трекер заданий":["Трекер заданий","Контроль исполнителей, сроков и статусов."],"Ивенты для вышки":["Мероприятия для вышки","Отдельные события старшего состава."],"Достижения":["Достижения участников","Награды и история достижений."]};
function generic(p){let d=pageDetails[p];let extras=p==="Таблицы"?`<div class="panel"><div style="display:flex;gap:10px;margin-bottom:18px"><button class="login-button" id="tabTable">Таблица</button><button class="discord-button" style="width:auto;margin:0" id="tabPt">ПТ</button></div><div id="tabContent"><p style="color:#a8c3b4">Записи будут загружаться из базы после добавления соответствующего модуля.</p></div></div>`:p==="Шар предсказаний"?`<div class="panel" style="text-align:center"><div style="font-size:80px;color:#8eb69b">✧</div><input id="question" placeholder="Задайте свой вопрос..." style="max-width:420px;width:100%;padding:13px;border-radius:10px;background:#061f1e;border:1px solid #8eb69b66;color:white"><br><button class="primary-button" style="max-width:220px" id="predict">Получить ответ</button><p id="answer" style="color:#bde4c9"></p></div>`:p==="Колесо фортуны"?`<div class="panel" style="text-align:center"><div id="wheel" style="font-size:100px;color:#9fc9ae">◉</div><button class="primary-button" style="max-width:220px" id="spin">Крутить колесо</button><p id="wheelResult"></p></div>`:`<div class="page-grid">${["Общий раздел","Моя подветка","История и результаты"].map((x,i)=>`<article class="feature-card"><div class="symbol">${["✿","♧","▤"][i]}</div><h3>${x}</h3><p>Раздел подготовлен для подключения рабочих данных.</p></article>`).join("")}</div>`;
return `${heading(d[0],d[1])}<div class="panel" style="margin-bottom:15px"><h3>${d[0]}</h3><p style="color:#a8c3b4;font-size:12px;line-height:1.7">${d[1]} Данные будут храниться в PostgreSQL. Доступ зависит от роли пользователя и подветки.</p></div>${extras}`}
function render(p){current=p;document.querySelectorAll(".nav-link").forEach((b,i)=>b.classList.toggle("active",pages[i]===p));content.innerHTML=p==="Главная"?home():generic(p);if(p==="Таблицы"){document.getElementById("tabPt").onclick=()=>document.getElementById("tabContent").innerHTML='<p style="color:#a8c3b4">Поля ПТ: User ID, неделя, статусы П / О / У, зарплата. Модуль заполнения будет следующим этапом.</p>';document.getElementById("tabTable").onclick=()=>render("Таблицы")}if(p==="Шар предсказаний")document.getElementById("predict").onclick=()=>document.getElementById("answer").textContent=["Да, всё возможно ♡","Скоро появится ясность","Лучше попробовать ещё раз","Сегодня удачный день"][Math.floor(Math.random()*4)];if(p==="Колесо фортуны")document.getElementById("spin").onclick=()=>{let w=document.getElementById("wheel");w.animate([{transform:"rotate(0)"},{transform:"rotate(1080deg)"}],{duration:1700,easing:"cubic-bezier(.1,.7,.1,1)"});setTimeout(()=>document.getElementById("wheelResult").textContent="Ваш результат: "+["Удача","Бонус","Дополнительный шанс","Сюрприз"][Math.floor(Math.random()*4)],1700)}}
render("Главная");
document.getElementById("bunnyButton").onclick=()=>document.getElementById("bunnyPop").classList.toggle("show");document.getElementById("bunnyClose").onclick=()=>document.getElementById("bunnyPop").classList.remove("show");
const backdrop=document.getElementById("authBackdrop");document.getElementById("loginButton").onclick=async()=>{if(currentUser&&supabaseClient){if(confirm("Выйти из аккаунта?")){await supabaseClient.auth.signOut();currentUser=null;document.getElementById("loginButton").textContent="Войти";render(current);}}else backdrop.classList.add("show")};document.getElementById("authClose").onclick=()=>backdrop.classList.remove("show");backdrop.onclick=e=>{if(e.target===backdrop)backdrop.classList.remove("show")};
let registering=false;
const supabaseReady = Boolean(window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY && !window.SUPABASE_URL.includes('ВАШ-ПРОЕКТ') && !window.SUPABASE_ANON_KEY.includes('ВАШ_'));
const supabaseClient = supabaseReady ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
function updateAuthMode(){
 document.getElementById("authTitle").textContent=registering?"Регистрация":"Вход в аккаунт";
 document.getElementById("registerFields").hidden=!registering;
 document.getElementById("emailField").hidden=!registering;
 const identity=document.getElementById('identityInput');
 identity.name=registering?'username':'email';
 identity.type=registering?'text':'email';
 identity.closest('label').firstChild.textContent=registering?'Логин':'Почта';
 identity.placeholder=registering?'Придумайте логин':'Введите почту';
 document.getElementById("authSwitch").innerHTML=registering?'Уже есть аккаунт? <button id="switchAuth">Войти</button>':'Нет аккаунта? <button id="switchAuth">Регистрация</button>';
 document.getElementById("switchAuth").onclick=()=>{registering=!registering;updateAuthMode()};
}
document.getElementById("switchAuth").onclick=()=>{registering=!registering;updateAuthMode()};
function showUser(user, profile){
 currentUser=profile||{username:user.user_metadata?.username||user.email};
 document.getElementById('loginButton').textContent=currentUser.username||user.email;
 render(current);
}
async function refreshSession(){
 if(!supabaseClient)return;
 const {data:{session}}=await supabaseClient.auth.getSession();
 if(session){
  const {data:profile}=await supabaseClient.from('profiles').select('id,username,email,role,branch_id').eq('id',session.user.id).maybeSingle();
  showUser(session.user,profile);
 }
}
document.getElementById('authForm').onsubmit=async e=>{
 e.preventDefault();
 if(!supabaseClient)return alert('Сначала укажи URL и anon key в файле supabase-config.js.');
 const identity=e.target.querySelector('[name=email], [name=username]').value.trim();
 const password=e.target.querySelector('[name=password]').value;
 try{
  if(registering){
   const username=identity;
   const email=e.target.querySelector('[name=email]').value.trim().toLowerCase();
   const repeat=e.target.querySelector('[name=passwordRepeat]').value;
   if(username.length<3)return alert('Логин должен содержать минимум 3 символа.');
   if(password.length<6)return alert('Пароль должен содержать минимум 6 символов.');
   if(password!==repeat)return alert('Пароли не совпадают.');
   const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{username}}});
   if(error)throw error;
   if(data.user && !data.session){alert('Аккаунт создан. Подтверди почту по ссылке из письма, затем войди.');registering=false;updateAuthMode();return;}
   if(data.user)showUser(data.user,{username,email,role:'support'});
  }else{
   const email=identity.toLowerCase();
   const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
   if(error)throw error;
   const {data:profile}=await supabaseClient.from('profiles').select('id,username,email,role,branch_id').eq('id',data.user.id).maybeSingle();
   showUser(data.user,profile);
  }
  backdrop.classList.remove('show');
 }catch(err){alert(err.message||'Не удалось выполнить вход.');}
};
document.getElementById('discordButton').onclick=async()=>{
 if(!supabaseClient)return alert('Сначала настрой Supabase в supabase-config.js.');
 const {error}=await supabaseClient.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+location.pathname}});
 if(error)alert(error.message);
};
// Кнопка аккаунта: повторное нажатие позволяет выйти из системы.
document.getElementById('loginButton').addEventListener('contextmenu',async e=>{
 e.preventDefault();
 if(supabaseClient && currentUser && confirm('Выйти из аккаунта?')){await supabaseClient.auth.signOut();currentUser=null;document.getElementById('loginButton').textContent='Войти';render(current);}
});
if(supabaseClient){
 supabaseClient.auth.onAuthStateChange(async(_event,session)=>{
  if(!session){currentUser=null;document.getElementById('loginButton').textContent='Войти';render(current);}
 });
 refreshSession();
}
