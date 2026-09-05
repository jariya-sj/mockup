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
function doLogin(){
  const rid=state.selectedLoginRole;if(!rid){notify("กรุณาเลือกบทบาทก่อน");return;}
  state.loggedIn[rid]=true;state.role=rid;closeModal("loginModal");notify("เข้าสู่ระบบสำเร็จในฐานะ "+rLabel(rid));render();
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
  let ex="";
  if(tp==="student")ex=`<label>สถาบันการศึกษา</label><input placeholder="ชื่อมหาวิทยาลัย"><label>สาขาวิชา</label><input placeholder="Computer Science">`;
  if(tp==="enterprise")ex=`<label>ชื่อบริษัท/องค์กร</label><input placeholder="บริษัท XYZ จำกัด"><label>เลขทะเบียนนิติบุคคล</label><input placeholder="0105560000000">`;
  if(tp==="institution")ex=`<label>ชื่อสถาบัน</label><input placeholder="มหาวิทยาลัย..."><label>คณะ/ภาควิชา</label><input placeholder="คณะวิศวกรรมศาสตร์">`;
  document.getElementById("registerFormArea").innerHTML=`<label>ชื่อ-นามสกุล</label><input placeholder="กรอกชื่อ-นามสกุล"><label>อีเมล</label><input type="email" placeholder="example@email.com"><label>เบอร์โทรศัพท์</label><input type="tel" placeholder="0XX-XXX-XXXX">${ex}<label>รหัสผ่าน</label><input type="password" placeholder="อย่างน้อย 8 ตัว"><label>ยืนยันรหัสผ่าน</label><input type="password" placeholder="กรอกอีกครั้ง"><div class="actions"><button class="primary" style="flex:1" id="btn-do-register" onclick="doRegister()">สมัครสมาชิก</button><button class="ghost" onclick="closeModal('registerModal')">ยกเลิก</button></div>`;
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

