/* ========== Helpers ========== */
function rLabel(id){return{student:"นักศึกษา",enterprise:"สถานประกอบการ",institution:"สถาบันการศึกษา",admin:"ผู้ดูแลระบบ",general:"ผู้ใช้งานทั่วไป"}[id]||id;}
function notify(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove("show"),2800);}
function openModal(id){document.getElementById(id).classList.remove("hidden");}
function closeModal(id){document.getElementById(id).classList.add("hidden");}
function unreadNotifCount(){return state.notifications.filter(n=>!n.read).length;}
function statusChipClass(s){return s==="ผ่านการสมัคร"?"status-accepted":s==="ไม่ผ่านการสมัคร"?"status-rejected":s==="อ่านแล้ว"?"status-read":"status-pending";}
function statusLabel(s){return s||"รอการตรวจสอบ";}

/* ========== Topbar ========== */
function renderTopbar(){
  const el=document.getElementById("topbarActions");
  if(state.role==="general"){
    el.innerHTML=`<button class="btn-login" id="btn-login-topbar" onclick="openLoginModal()">เข้าสู่ระบบ</button><button class="btn-register" id="btn-register-topbar" onclick="openRegisterModal()">สมัครสมาชิก</button>`;
  }else{
    const isStudent=state.role==="student";
    const hasProfile=state.role==="student"||state.role==="enterprise";
    const avatarClass=hasProfile?"user-avatar clickable":"user-avatar";
    const avatarClick=state.role==="student"?`onclick="setScreen('profile')" title="ดูข้อมูลส่วนตัว"`:state.role==="enterprise"?`onclick="setScreen('profile')" title="ดูข้อมูลส่วนตัว"`:"";
    const initial=state.role[0].toUpperCase();
    const unread=unreadNotifCount();
    const notifBellHtml=isStudent?`<button class="notif-btn" id="btn-notif-inbox" onclick="openNotifModal()" title="กล่องข้อความ">📬${unread>0?`<span class="notif-dot"></span>`:""}</button>`:"";
    el.innerHTML=`${notifBellHtml}<div class="user-info"><div class="${avatarClass}" id="topbar-avatar" ${avatarClick}>${initial}</div><span>${rLabel(state.role)}</span></div><button class="btn-logout" id="btn-logout-topbar" onclick="logout()">ออกจากระบบ</button>`;
  }
}
function logout(){state.loggedIn[state.role]=false;state.role="general";notify("ออกจากระบบเรียบร้อย");render();}

/* ========== Login ========== */
function openLoginModal(){
  state.selectedLoginRole=null;
  const grid=document.getElementById("loginRoleGrid");
  grid.style.display="";
  grid.innerHTML=rolesData.map(r=>`<div class="role-card" id="lrc-${r.id}" onclick="selectLoginRole('${r.id}')"><div class="role-icon">${r.icon}</div><div class="role-name">${r.label}</div><div class="role-desc">${r.desc}</div></div>`).join("");
  document.getElementById("loginFormArea").innerHTML=`<p style="text-align:center;color:var(--muted);font-size:13px;margin-top:12px">กรุณาเลือกบทบาทของคุณ</p>`;
  openModal("loginModal");
}
function selectLoginRole(rid){
  state.selectedLoginRole=rid;
  document.getElementById("loginRoleGrid").style.display="none";
  document.getElementById("loginFormArea").innerHTML=`
    <p style="font-size:13px;color:var(--muted);margin:0 0 14px">บทบาท: <strong style="color:var(--navy)">${rLabel(rid)}</strong>
      <button onclick="resetLoginRole()" style="background:none;border:none;color:var(--blue);font-size:12px;cursor:pointer;margin-left:8px;padding:0;font-weight:700">เปลี่ยนบทบาท</button>
    </p>
    <label>อีเมล</label><input type="email" id="loginEmail" value="${rid}@demo.local">
    <label>รหัสผ่าน</label><input type="password" id="loginPassword" value="password">
    <div class="actions"><button class="primary" style="flex:1" id="btn-do-login" onclick="doLogin()">เข้าสู่ระบบ</button><button class="ghost" onclick="closeModal('loginModal')">ยกเลิก</button></div>`;
}
function resetLoginRole(){
  state.selectedLoginRole=null;
  document.getElementById("loginRoleGrid").style.display="";
  document.getElementById("loginFormArea").innerHTML=`<p style="text-align:center;color:var(--muted);font-size:13px;margin-top:12px">กรุณาเลือกบทบาทของคุณ</p>`;
}
async function doLogin(){
  const rid=state.selectedLoginRole;if(!rid){notify("กรุณาเลือกบทบาทก่อน");return;}
  state.loggedIn[rid]=true;state.role=rid;closeModal("loginModal");notify("เข้าสู่ระบบสำเร็จในฐานะ "+rLabel(rid));if(rid==="enterprise")await loadEnterprisePosts();render();
}

/* ========== Register ========== */
function openRegisterModal(fromJob=false){
  state.selectedRegisterType="student";
  const typeRow=document.getElementById("registerTypeRow");
  if(fromJob){
    typeRow.innerHTML="";
    document.querySelector("#registerModal h2").textContent="สมัครสมาชิก (นักศึกษา)";
  }else{
    document.querySelector("#registerModal h2").textContent="สมัครสมาชิก";
    const types=[{id:"student",label:"นักศึกษา"},{id:"enterprise",label:"สถานประกอบการ"},{id:"institution",label:"สถาบันการศึกษา"}];
    typeRow.innerHTML=types.map(t=>`<button class="register-type-btn ${t.id===state.selectedRegisterType?"selected":""}" id="rbt-${t.id}" onclick="selectRegisterType('${t.id}')">${t.label}</button>`).join("");
  }
  renderRegForm();openModal("registerModal");
}
function selectRegisterType(type){state.selectedRegisterType=type;document.querySelectorAll(".register-type-btn").forEach(b=>b.classList.remove("selected"));document.getElementById("rbt-"+type).classList.add("selected");renderRegForm();}
function renderRegForm(){
  const tp=state.selectedRegisterType;
  if(tp==="enterprise"){renderEnterpriseCompanyStep();return;}
  let ex="";
  if(tp==="student")ex=`<label>สถาบันการศึกษา</label><input placeholder="ชื่อมหาวิทยาลัย"><label>สาขาวิชา</label><input placeholder="Computer Science">`;
  if(tp==="institution")ex=`<label>ชื่อสถาบัน</label><input placeholder="มหาวิทยาลัย..."><label>คณะ/ภาควิชา</label><input placeholder="คณะวิศวกรรมศาสตร์">`;
  document.getElementById("registerFormArea").innerHTML=`<label>ชื่อ-นามสกุล</label><input placeholder="กรอกชื่อ-นามสกุล"><label>อีเมล</label><input type="email" placeholder="example@email.com"><label>เบอร์โทรศัพท์</label><input type="tel" placeholder="0XX-XXX-XXXX">${ex}<label>รหัสผ่าน</label><input type="password" placeholder="อย่างน้อย 8 ตัว"><label>ยืนยันรหัสผ่าน</label><input type="password" placeholder="กรอกอีกครั้ง"><div class="actions"><button class="primary" style="flex:1" id="btn-do-register" onclick="doRegister()">สมัครสมาชิก</button><button class="ghost" onclick="closeModal('registerModal')">ยกเลิก</button></div>`;
}
let enterpriseRegistrationData={};
function renderEnterpriseCompanyStep(){
  document.getElementById("registerFormArea").innerHTML=`
    <p class="register-step">ขั้นตอนที่ 1 จาก 2 — ข้อมูลบริษัท</p>
    <label>ชื่อบริษัท/องค์กร</label><input id="regCompanyName" value="${enterpriseRegistrationData.company_name||""}" placeholder="บริษัท XYZ จำกัด">
    <label>เลขทะเบียนนิติบุคคล</label><input id="regCompanyNumber" value="${enterpriseRegistrationData.registration_number||""}" maxlength="13" placeholder="0105560000000">
    <label>ประเภทธุรกิจ</label><input id="regBusinessType" value="${enterpriseRegistrationData.business_type||""}" placeholder="พัฒนาซอฟต์แวร์">
    <label>ที่อยู่บริษัท</label><textarea id="regCompanyAddress" placeholder="ที่อยู่สำนักงานใหญ่">${enterpriseRegistrationData.company_address||""}</textarea>
    <div class="grid two"><div><label>เบอร์โทรบริษัท</label><input id="regCompanyPhone" value="${enterpriseRegistrationData.company_phone||""}" placeholder="02-000-0000"></div><div><label>อีเมลบริษัท</label><input type="email" id="regCompanyEmail" value="${enterpriseRegistrationData.company_email||""}" placeholder="contact@company.com"></div></div>
    <div class="actions"><button class="primary" style="flex:1" onclick="goToEnterpriseHrStep()">ถัดไป: ข้อมูลผู้สมัคร (HR)</button><button class="ghost" onclick="closeModal('registerModal')">ยกเลิก</button></div>`;
}
function goToEnterpriseHrStep(){
  const fields={company_name:"regCompanyName",registration_number:"regCompanyNumber",business_type:"regBusinessType",company_address:"regCompanyAddress",company_phone:"regCompanyPhone",company_email:"regCompanyEmail"};
  for(const [key,id] of Object.entries(fields)){enterpriseRegistrationData[key]=document.getElementById(id).value.trim();}
  if(Object.values(fields).some(id=>!document.getElementById(id).value.trim())){notify("กรุณากรอกข้อมูลบริษัทให้ครบ");return;}
  document.getElementById("registerFormArea").innerHTML=`
    <p class="register-step">ขั้นตอนที่ 2 จาก 2 — ข้อมูลผู้สมัคร/HR</p>
    <label>ชื่อ-นามสกุล</label><input id="regHrName" placeholder="ชื่อผู้ติดต่อฝ่ายบุคคล">
    <div class="grid two"><div><label>ตำแหน่ง</label><input id="regHrPosition" placeholder="HR Officer"></div><div><label>แผนก</label><input id="regHrDepartment" placeholder="ฝ่ายทรัพยากรบุคคล"></div></div>
    <div class="grid two"><div><label>เบอร์โทรศัพท์</label><input id="regHrPhone" placeholder="0XX-XXX-XXXX"></div><div><label>อีเมล</label><input type="email" id="regHrEmail" placeholder="hr@company.com"></div></div>
    <label>รหัสผ่าน</label><input type="password" id="regHrPassword" placeholder="อย่างน้อย 8 ตัว">
    <label>ยืนยันรหัสผ่าน</label><input type="password" id="regHrConfirmPassword" placeholder="กรอกอีกครั้ง">
    <div class="actions"><button class="ghost" onclick="renderEnterpriseCompanyStep()">← ย้อนกลับ</button><button class="primary" style="flex:1" onclick="submitEnterpriseRegistration()">สมัครสมาชิก</button></div>`;
}
function getCookie(name){
  try {
    if(!document || !document.cookie){return "";}
    const row=document.cookie.split("; ").find(r=>r.startsWith(name+"="));
    return row ? decodeURIComponent(row.split("=").slice(1).join("=")) : "";
  }catch(error){
    console.warn("getCookie failed:", error);
    return "";
  }
}
window.getCookie = window.getCookie || getCookie;
window.getCsrfToken = function(){
  const token = getCookie("csrftoken");
  return token || "";
};
async function submitEnterpriseRegistration(){
  const ids={full_name:"regHrName",position:"regHrPosition",department:"regHrDepartment",hr_phone:"regHrPhone",hr_email:"regHrEmail",password:"regHrPassword",confirm_password:"regHrConfirmPassword"};
  for(const [key,id] of Object.entries(ids)){enterpriseRegistrationData[key]=document.getElementById(id).value.trim();}
  if(["full_name","position","hr_phone","hr_email","password","confirm_password"].some(k=>!enterpriseRegistrationData[k])){notify("กรุณากรอกข้อมูล HR ให้ครบ");return;}
  try{
    const csrfToken=window.getCsrfToken ? window.getCsrfToken() : "";
    const headers={"Content-Type":"application/json"};
    if(csrfToken){headers["X-CSRFToken"]=csrfToken;}
    const response=await fetch("/api/enterprise/register/",{method:"POST",headers,body:JSON.stringify(enterpriseRegistrationData)});
    const result=await response.json();if(!response.ok)throw new Error(result.error||"สมัครสมาชิกไม่สำเร็จ");
    state.enterpriseProfile.company=result.company_name;state.enterpriseProfile.name=enterpriseRegistrationData.full_name;state.enterpriseProfile.position=enterpriseRegistrationData.position;state.enterpriseProfile.department=enterpriseRegistrationData.department;state.enterpriseProfile.phone=enterpriseRegistrationData.hr_phone;state.enterpriseProfile.email=enterpriseRegistrationData.hr_email;state.enterpriseProfile.address=enterpriseRegistrationData.company_address;
    state.loggedIn.enterprise=true;state.role="enterprise";enterpriseRegistrationData={};closeModal("registerModal");notify("สมัครสมาชิกสถานประกอบการสำเร็จ");await loadEnterprisePosts();render();
  }catch(error){notify(error.message);}
}
function doRegister(){
  const roleType=state.selectedRegisterType;
  closeModal("registerModal");
  const loginRoleMap={student:"student",enterprise:"enterprise",institution:"institution"};
  const loginRole=loginRoleMap[roleType];
  if(loginRole){
    state.loggedIn[loginRole]=true;
    state.role=loginRole;
    if(loginRole==="student"){
      // Show skill selection modal after student registration
      openSkillPickerModal();
    } else {
      notify("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ DEK INTERN");
      render();
    }
  }else{
    notify("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ");
  }
}

