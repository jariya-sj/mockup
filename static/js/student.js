/* ========== Skill Picker Modal (post-registration) ========== */
const skillPickerGroups=[
  {id:"technical",title:"Technical Skill",icon:"",desc:"ความสามารถด้านเครื่องมือและเทคโนโลยี",color:"#eff6ff",borderColor:"#bfdbfe",textColor:"#1d4ed8",
   options:["Python","JavaScript","HTML","CSS","SQL","React","Node.js","Java","C/C++","Git","TypeScript","PHP","MongoDB","Docker","UI/UX Design","Power BI","Excel","Machine Learning"]},
  {id:"soft",title:"Soft Skill",icon:"",desc:"ทักษะการทำงานร่วมกับผู้อื่น",color:"#f0fdf4",borderColor:"#bbf7d0",textColor:"#15803d",
   options:["การสื่อสาร","การทำงานเป็นทีม","การบริหารเวลา","การปรับตัว","ภาวะผู้นำ","การนำเสนอ","ควบคุมอารมณ์ได้ดี","การเจรจาต่อรอง","ความคิดสร้างสรรค์","มนุษยสัมพันธ์"]},
  {id:"cognitive",title:"Cognitive Skill",icon:"",desc:"ทักษะด้านการคิด วิเคราะห์ และเรียนรู้",color:"#faf5ff",borderColor:"#d8b4fe",textColor:"#7c3aed",
   options:["การคิดวิเคราะห์","การแก้ปัญหา","การตัดสินใจ","การเรียนรู้เร็ว","การคิดเชิงระบบ","การวางแผน","ความจำดี","การประเมินสถานการณ์"]}
];
let skillPickerSelected=new Set();
function openSkillPickerModal(){
  skillPickerSelected=new Set(state.studentSelectedSkills||[]);
  renderSkillPickerModal();
  openModal("skillPickerModal");
}
function toggleSkillPick(skill){
  if(skillPickerSelected.has(skill)){skillPickerSelected.delete(skill);}
  else{skillPickerSelected.add(skill);}
  renderSkillPickerModal();
}
function renderSkillPickerModal(){
  const html=skillPickerGroups.map(group=>{
    const optionsHtml=group.options.map(opt=>{
      const sel=skillPickerSelected.has(opt);
      return `<button onclick="toggleSkillPick('${opt}')" style="display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:6px 13px;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;border:1.5px solid ${sel?group.borderColor:"#d1d5db"};background:${sel?group.color:"#f9fafb"};color:${sel?group.textColor:"#6b7280"};">${sel?"✓ ":""}${opt}</button>`;
    }).join("");
    return `<div style="border:1px solid var(--line);border-radius:10px;padding:14px;margin-bottom:12px;background:#fff">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:18px">${group.icon}</span><strong style="color:var(--navy);font-size:14px">${group.title}</strong></div>
      <p style="font-size:12px;color:var(--muted);margin:0 0 10px">${group.desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:7px">${optionsHtml}</div>
    </div>`;
  }).join("");
  const count=skillPickerSelected.size;
  document.getElementById("skillPickerBody").innerHTML=html;
  document.getElementById("skillPickerCount").textContent=count>0?`เลือกแล้ว ${count} ทักษะ`:"ยังไม่ได้เลือกทักษะ";
}
function saveSkillPicker(){
  state.studentSelectedSkills=Array.from(skillPickerSelected);
  closeModal("skillPickerModal");
  notify("สมัครสมาชิกสำเร็จ! บันทึกทักษะเรียบร้อยแล้ว");
  render();
}
function skipSkillPicker(){
  closeModal("skillPickerModal");
  notify("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ DEK INTERN");
  render();
}

/* ========== Favorites ========== */
function toggleFavorite(jobId,e){
  if(e){e.stopPropagation();}
  const idx=state.favorites.indexOf(jobId);
  if(idx>=0){state.favorites.splice(idx,1);notify("ลบออกจากรายการโปรดแล้ว");}
  else{state.favorites.push(jobId);notify("❤️ เพิ่มในรายการโปรดแล้ว");}
  render();
}
function isFav(jobId){return state.favorites.includes(jobId);}

/* ========== Notifications ========== */
function openNotifModal(){
  const unread=state.notifications.filter(n=>!n.read).length;
  const html=state.notifications.map(n=>`
    <div class="notif-item" onclick="readNotif('${n.id}','${n.jobId}')">
      <div class="notif-icon">${n.read?"📨":"📬"}</div>
      <div class="notif-text">
        <strong>${n.title}${!n.read?`<span class="notif-badge-new">ใหม่</span>`:""}</strong>
        <span>${n.desc}</span><br>
        <span style="font-size:11px;color:#94a3b8;margin-top:2px;display:block">${n.time}</span>
      </div>
    </div>`).join("");
  document.getElementById("notifListContent").innerHTML=html||`<p style="color:var(--muted);text-align:center;padding:20px">ไม่มีการแจ้งเตือน</p>`;
  openModal("notifModal");
}
function readNotif(nId,jobId){
  const n=state.notifications.find(x=>x.id===nId);
  if(n)n.read=true;
  closeModal("notifModal");
  renderTopbar();
  openJobDetail(jobId);
}

/* ========== Job Detail ========== */
function openJobDetail(jobId){
  const job=jobsData.find(j=>j.id===jobId);if(!job)return;
  state.currentJobId=jobId;const d=job.detail;
  const isFaved=isFav(jobId);
  const alreadyApplied=state.applications.some(a=>a.jobId===jobId);
  let applyBtn="";
  if(state.role==="student"){
    if(alreadyApplied){
      applyBtn=`<button class="ghost" style="width:100%;margin-top:4px" disabled>สมัครแล้ว</button>`;
    }else{
      applyBtn=`<button class="success" style="width:100%;margin-top:4px" onclick="openApplyForm('${job.id}')">สมัครงานตำแหน่งนี้</button>`;
    }

  }
  if(state.role==="general"){
    applyBtn=`<button class="success" style="width:100%;margin-top:4px" onclick="registerFromJob('${job.id}')">สมัคร</button>`;
  }
  const favHtml=state.role==="student"?`<button class="fav-btn ${isFaved?"active":""}" onclick="toggleFavAndRefreshModal('${jobId}')">${isFaved?"❤️ บันทึกแล้ว":"🤍 บันทึกรายการโปรด"}</button>`:"";
  document.getElementById("jobDetailContent").innerHTML=`
    <div class="job-detail-header">
      <p style="margin:0 0 6px;font-size:12px;color:#bfdbfe">ประกาศรับสมัครงาน | ตำแหน่งงาน</p>
      <h3 style="margin:0 0 4px;font-size:20px">${job.title}</h3>
      <p style="margin:0 0 4px;font-size:13px;color:#bfdbfe">${job.dept}</p>
      <p style="margin:0;font-size:12px;color:#93c5fd">🏢 ${job.company}</p>
    </div>
    ${job.newGrad?`<p style="background:#fef9c3;border:1px solid #fde047;border-radius:6px;padding:10px;font-size:13px;color:#854d0e;margin:0 0 14px">📢 ${d.notice}</p>`:""}
    <div class="job-detail-section"><h4>📍 สถานที่ปฏิบัติงาน</h4><p>${d.locationFull}</p></div>
    <div class="job-detail-section"><h4>💰 เงินเดือน</h4><span class="salary-badge">${job.salary}</span></div>
    <div class="job-detail-section"><h4>🎁 สวัสดิการ</h4><div class="benefit-grid">${d.benefits.map(b=>`<div class="benefit-item">✅ <span>${b}</span></div>`).join("")}</div></div>
    <div class="job-detail-section"><h4>🕒 เวลาทำงาน</h4><p>${d.workHours}</p></div>
    <div class="job-detail-section"><h4>🛠️ หน้าที่ความรับผิดชอบ</h4><ul>${d.responsibilities.map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="job-detail-section"><h4>🎯 คุณสมบัติผู้สมัคร</h4><ul>${d.requirements.map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="job-detail-section"><h4>📌 ข้อกำหนดเพิ่มเติม</h4><p>${d.extra}</p></div>
    ${d.note?`<div class="job-detail-section"><h4>📝 หมายเหตุ</h4><p>${d.note}</p></div>`:""}
    <div class="job-detail-section"><h4>📞 ช่องทางการสมัครงาน</h4>
      <div class="contact-box">
        <p>👤 <strong>ผู้ประสานงาน:</strong> ${d.contact.name}</p>
        <p>📞 <strong>โทร:</strong> ${d.contact.phone}</p>
        <p>💬 <strong>Line ID:</strong> ${d.contact.line}</p>
        <p>📧 <strong>Email:</strong> ${d.contact.email}</p>
      </div>
    </div>
    <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">${favHtml}${applyBtn}<button class="ghost" style="width:100%" onclick="closeModal('jobDetailModal')">ปิด</button></div>`;
  openModal("jobDetailModal");
}
function registerFromJob(jobId){
  state.currentJobId=jobId;
  closeModal("jobDetailModal");
  openRegisterModal(true);
}
function toggleFavAndRefreshModal(jobId){
  toggleFavorite(jobId,null);
  // re-render modal content without closing
  openJobDetail(jobId);
}

/* ========== Apply Form ========== */
function openApplyForm(jobId){
  const job=jobsData.find(j=>j.id===jobId)||jobsData.find(j=>j.id===state.currentJobId);
  closeModal("jobDetailModal");
  state.currentJobId=jobId||(job&&job.id)||state.currentJobId;
  document.getElementById("applyJobTitle").textContent="ตำแหน่ง: "+(job?job.title:"")+" — "+(job?job.company:"");
  document.getElementById("applyFormContent").innerHTML=`
    <div class="form-row">
      <div><label>ชื่อ</label><input placeholder="ชื่อจริง"></div>
      <div><label>นามสกุล</label><input placeholder="นามสกุล"></div>
    </div>
    <label>เบอร์โทรติดต่อ</label><input type="tel" placeholder="0XX-XXX-XXXX">
    <label>อีเมล</label><input type="email" placeholder="your@email.com">
    <label>Line ID (ไม่บังคับ)</label><input placeholder="@lineid">
    <label>แนบ Resume / CV</label>
    <div class="file-upload-area" onclick="notify('เปิด File picker สำหรับ Resume')">
      <div class="upload-icon">📄</div>
      <p><strong>คลิกเพื่ออัปโหลด Resume</strong></p>
      <p>รองรับ PDF, DOC, DOCX (ไม่เกิน 5 MB)</p>
    </div>
    <label>Cover Letter (ไม่บังคับ)</label>
    <textarea placeholder="แนะนำตัวเองและเหตุผลที่สนใจตำแหน่งนี้..."></textarea>
    <div class="actions">
      <button class="success" style="flex:1" onclick="submitApplication('${state.currentJobId}')">ส่งใบสมัคร</button>
      <button class="ghost" onclick="closeModal('applyModal')">ยกเลิก</button>
    </div>`;
  openModal("applyModal");

}

function submitApplication(jobId){
  const jid=jobId||state.currentJobId;
  if(jid && !state.applications.some(a=>a.jobId===jid)){
    state.applications.push({jobId:jid,appliedAt:new Date().toISOString().slice(0,10),status:"รอการตรวจสอบ"});
  }
  closeModal("applyModal");
  notify("ส่งใบสมัครงานเรียบร้อยแล้ว");
  state.screen.student="applications";
  render();
}

/* ========== Student Profile Modal ========== */
let profileEditMode=false;
function openProfileModal(){
  profileEditMode=false;
  renderProfileModal();
  openModal("profileModal");
}
function renderProfileModal(){
  const s=state.studentProfile;
  const initial=s.name?s.name[0].toUpperCase():"K";
  const coverEditable=profileEditMode?"editable":"";
  const coverClick=profileEditMode?`onclick="notify('เปิด File picker เพื่อเปลี่ยนรูปปก')"` :"";
  const skillsHtml=studentSkillsData.map(sk=>`<span class="skill-badge ${sk.verified?"verified":""}">${sk.verified?"✓ ":""}${sk.name}</span>`).join("");

  let bodyHtml="";
  if(profileEditMode){
    bodyHtml=`
      <div class="profile-edit-grid">
        <div><label>ชื่อ-นามสกุล</label><input id="ef-name" value="${s.name}"></div>
        <div><label>รหัสนักศึกษา</label><input id="ef-id" value="${s.studentId}"></div>
        <div><label>มหาวิทยาลัย</label><input id="ef-univ" value="${s.university}"></div>
        <div><label>สาขาวิชา</label><input id="ef-major" value="${s.major}"></div>
        <div><label>GPA</label><input id="ef-gpa" value="${s.gpa}"></div>
      </div>`;
  }else{
    bodyHtml=`
      <div class="profile-fields-grid">
        <div class="profile-field-box"><p class="profile-field-label">ชื่อ-นามสกุล</p><p class="profile-field-value">${s.name}</p></div>
        <div class="profile-field-box"><p class="profile-field-label">รหัสนักศึกษา</p><p class="profile-field-value">${s.studentId}</p></div>
        <div class="profile-field-box"><p class="profile-field-label">มหาวิทยาลัย</p><p class="profile-field-value">${s.university}</p></div>
        <div class="profile-field-box"><p class="profile-field-label">สาขาวิชา</p><p class="profile-field-value">${s.major}</p></div>
        <div class="profile-field-box"><p class="profile-field-label">GPA</p><p class="profile-field-value">${s.gpa}</p></div>
      </div>`;
  }

  document.getElementById("profileModalContent").innerHTML=`
    <div class="cover-photo-outer">
      <div class="cover-photo-wrap ${coverEditable}" ${coverClick}>
        <div class="cover-photo-overlay"><span>เปลี่ยนรูปปก</span></div>
      </div>
      <div class="profile-avatar-wrap">
        <div class="profile-avatar-large">${initial}</div>
      </div>
    </div>
    <div class="profile-body">
      <div class="profile-name-row">
        <div>
          <p class="profile-name">${s.name}</p>
          <p class="profile-sub-text">${s.major} · ${s.university}</p>
        </div>
        <div>
          ${profileEditMode
            ?`<div style="display:flex;gap:8px">
                <button class="success" onclick="saveStudentProfile()">บันทึก</button>
                <button class="ghost" onclick="profileEditMode=false;renderProfileModal()">ยกเลิก</button>
              </div>`
            :``
          }
        </div>
      </div>
      ${bodyHtml}
      <div style="margin-top:6px">
        <p class="skills-section-title">ทักษะ (Skills)</p>
        <div class="skill-badges-wrap">${skillsHtml}</div>
      </div>
    </div>`;
}
function saveStudentProfile(){
  state.studentProfile={
    name:document.getElementById("ef-name").value||state.studentProfile.name,
    studentId:document.getElementById("ef-id").value||state.studentProfile.studentId,
    university:document.getElementById("ef-univ").value||state.studentProfile.university,
    major:document.getElementById("ef-major").value||state.studentProfile.major,
    gpa:document.getElementById("ef-gpa").value||state.studentProfile.gpa
  };
  profileEditMode=false;
  renderProfileModal();
  notify("บันทึกโปรไฟล์เรียบร้อยแล้ว");
  renderTopbar();
}

let studentPageEditMode=false;
function skillGroupsHtml(editable=false){
  return skillGroups.map(group=>`<div class="skill-category"><h4>${group.title}</h4><p>${group.desc}</p><div class="skill-options">${group.options.map(option=>editable
    ?`<label class="skill-option"><input type="checkbox" name="student-skill" value="${option}" ${state.studentSelectedSkills.includes(option)?"checked":""}> ${option}</label>`
    :state.studentSelectedSkills.includes(option)?`<span class="skill-badge verified">✓ ${option}</span>`:"").join("")}</div></div>`).join("");
}
function studentProfilePage(){
  const s=state.studentProfile;
  const fields=studentPageEditMode?`<div class="profile-edit-grid"><div><label>ชื่อ-นามสกุล</label><input id="spf-name" value="${s.name}"></div><div><label>รหัสนักศึกษา</label><input id="spf-id" value="${s.studentId}"></div><div><label>มหาวิทยาลัย</label><input id="spf-univ" value="${s.university}"></div><div><label>สาขาวิชา</label><input id="spf-major" value="${s.major}"></div><div><label>GPA</label><input id="spf-gpa" value="${s.gpa}"></div></div>`
    :`<div class="profile-fields-grid"><div class="profile-field-box"><p class="profile-field-label">ชื่อ-นามสกุล</p><p class="profile-field-value">${s.name}</p></div><div class="profile-field-box"><p class="profile-field-label">รหัสนักศึกษา</p><p class="profile-field-value">${s.studentId}</p></div><div class="profile-field-box"><p class="profile-field-label">มหาวิทยาลัย</p><p class="profile-field-value">${s.university}</p></div><div class="profile-field-box"><p class="profile-field-label">สาขาวิชา</p><p class="profile-field-value">${s.major}</p></div><div class="profile-field-box"><p class="profile-field-label">GPA</p><p class="profile-field-value">${s.gpa}</p></div></div>`;
  return `<div class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><h3>ข้อมูลส่วนตัว</h3><p class="small">ประวัติส่วนตัวและทักษะของนักศึกษา</p></div>${studentPageEditMode?`<div class="actions" style="margin:0"><button class="success" onclick="saveStudentProfilePage()">บันทึก</button><button class="ghost" onclick="studentPageEditMode=false;render()">ยกเลิก</button></div>`:`<button class="secondary" onclick="studentPageEditMode=true;render()">แก้ไขข้อมูล</button>`}</div>${fields}<div style="margin-top:18px"><p class="skills-section-title">ทักษะ (Skills)</p>${skillGroupsHtml(studentPageEditMode)}</div></div>`;
}
function saveStudentProfilePage(){
  state.studentProfile={name:document.getElementById("spf-name").value||state.studentProfile.name,studentId:document.getElementById("spf-id").value||state.studentProfile.studentId,university:document.getElementById("spf-univ").value||state.studentProfile.university,major:document.getElementById("spf-major").value||state.studentProfile.major,gpa:document.getElementById("spf-gpa").value||state.studentProfile.gpa};
  state.studentSelectedSkills=Array.from(document.querySelectorAll('input[name="student-skill"]:checked')).map(el=>el.value);
  studentPageEditMode=false; renderTopbar(); render(); notify("บันทึกข้อมูลส่วนตัวและทักษะเรียบร้อยแล้ว");
}

let enterprisePageEditMode=false;
function enterpriseProfilePage(){
  const e=state.enterpriseProfile;
  const fields=enterprisePageEditMode?`<div class="profile-edit-grid"><div><label>ชื่อบริษัท</label><input id="epf-company" value="${e.company}"></div><div><label>ชื่อ-นามสกุล</label><input id="epf-name" value="${e.name}"></div><div><label>รหัสพนักงาน</label><input id="epf-id" value="${e.employeeId}"></div><div><label>ตำแหน่ง</label><input id="epf-position" value="${e.position}"></div><div><label>แผนก</label><input id="epf-department" value="${e.department}"></div><div><label>เบอร์โทรศัพท์</label><input id="epf-phone" value="${e.phone}"></div><div><label>อีเมล</label><input id="epf-email" value="${e.email}"></div><div><label>ที่อยู่บริษัท</label><input id="epf-address" value="${e.address}"></div></div>`
  :`<div class="profile-fields-grid"><div class="profile-field-box"><p class="profile-field-label">ชื่อบริษัท</p><p class="profile-field-value">${e.company}</p></div><div class="profile-field-box"><p class="profile-field-label">ชื่อ-นามสกุล</p><p class="profile-field-value">${e.name}</p></div><div class="profile-field-box"><p class="profile-field-label">รหัสพนักงาน</p><p class="profile-field-value">${e.employeeId}</p></div><div class="profile-field-box"><p class="profile-field-label">ตำแหน่ง</p><p class="profile-field-value">${e.position}</p></div><div class="profile-field-box"><p class="profile-field-label">แผนก</p><p class="profile-field-value">${e.department}</p></div><div class="profile-field-box"><p class="profile-field-label">เบอร์โทรศัพท์</p><p class="profile-field-value">${e.phone}</p></div><div class="profile-field-box"><p class="profile-field-label">อีเมล</p><p class="profile-field-value">${e.email}</p></div><div class="profile-field-box"><p class="profile-field-label">ที่อยู่บริษัท</p><p class="profile-field-value">${e.address}</p></div></div>`;
  return `<div class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><h3>ข้อมูลส่วนตัวสถานประกอบการ</h3><p class="small">ข้อมูลบริษัทและผู้ประสานงาน</p></div>${enterprisePageEditMode?`<div class="actions" style="margin:0"><button class="success" onclick="saveEnterpriseProfile()">บันทึก</button><button class="ghost" onclick="enterprisePageEditMode=false;render()">ยกเลิก</button></div>`:`<button class="secondary" onclick="enterprisePageEditMode=true;render()">แก้ไขข้อมูล</button>`}</div>${fields}</div>`;
}
function saveEnterpriseProfile(){
  const e=state.enterpriseProfile; ["company","name","id","position","department","phone","email","address"].forEach(k=>{const el=document.getElementById("epf-"+k); if(el)e[k==="id"?"employeeId":k]=el.value||e[k==="id"?"employeeId":k];});
  enterprisePageEditMode=false; render(); notify("บันทึกข้อมูลสถานประกอบการเรียบร้อยแล้ว");
}

/* ========== Layout helpers ========== */
function appHeader(title,sub){return `<div class="app-header"><div><h2>${title}</h2><p>${sub}</p></div></div>`;}
function layout(role,content){
  const active=state.screen[role];
  return `${appHeader(rLabel(role),""+role.toUpperCase())}
  <div class="app-body"><aside class="side">${menu[role].map(item=>`<button class="${active===item[0]?"active":""}" onclick="setScreen('${item[0]}')">${item[1]}</button>`).join("")}</aside><section class="content">${content}</section></div>`;
}
function setScreen(screen){state.screen[state.role]=screen;render();}

/* ========== General View ========== */
function generalView(){
  return `${appHeader("DEK INTERN","แพลตฟอร์มหางานฝึกงานออนไลน์","Public")}<section class="jobs" id="jobList">${jobsData.map(job=>`<article class="job-row"><div><h3>${job.title}</h3><p class="small">${job.company} · 📍 ${job.location}</p><div class="tagbar">${job.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div></div><button class="secondary" onclick="openJobDetail('${job.id}')">ดูรายละเอียด</button></article>`).join("")}</section>`;
}

/* ========== Student View ========== */
function studentView(){
  const sc=state.screen.student;

  if(sc==="profile") return layout("student",studentProfilePage());

  // Job Recommendations (Smart Ranking)
  if(sc==="jobs"){
    const mySkills=studentSkillsData.map(s=>s.name.toLowerCase());
    const ranked=jobsData.map(job=>{
      const matchedTags=job.tags.filter(t=>mySkills.some(s=>s.includes(t.toLowerCase())||t.toLowerCase().includes(s)));
      const unmatchedTags=job.tags.filter(t=>!matchedTags.includes(t));
      const score=job.tags.length>0?Math.round((matchedTags.length/job.tags.length)*100):0;
      return{...job,matchedTags,unmatchedTags,score};
    }).sort((a,b)=>b.score-a.score);
    const rankClass=i=>i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"rank-other";
    const unread=state.notifications.filter(n=>!n.read).length;
    // Notification banner: pick the first unread notif
    const latestNotif=state.notifications.filter(n=>!n.read)[0];
    const bannerHtml="";

    return layout("student",`
      ${bannerHtml}
      <div class="match-header">
        <h3>งานที่แนะนำสำหรับคุณ</h3>
        <p>จัดลำดับตามความเข้ากันกับทักษะของคุณ</p>
      </div>
      <div class="grid" style="gap:14px">
        ${ranked.map((job,i)=>`
          <div class="match-job-card">
            <div class="rank-circle ${rankClass(i)}">#${i+1}</div>
            <div>
              <h3 style="margin:0 0 2px;font-size:15px;color:var(--navy)">${job.title}</h3>
              <p class="small" style="margin:0 0 4px">${job.company} · 📍 ${job.location}</p>
              <span class="match-score-badge">Match ${job.score}%</span>
              <div class="match-tags-row">
                ${job.matchedTags.map(t=>`<span class="match-tag-yes">✓ ${t}</span>`).join("")}
                ${job.unmatchedTags.map(t=>`<span class="match-tag-no">${t}</span>`).join("")}
              </div>
            </div>
            <div class="match-btn-col">
              <button class="fav-btn ${isFav(job.id)?"active":""}" onclick="toggleFavorite('${job.id}',event)">${isFav(job.id)?"❤️":"🤍"}</button>
              <button class="secondary" onclick="openJobDetail('${job.id}')">ดูรายละเอียด</button>
              <button class="primary" onclick="openApplyForm('${job.id}')">สมัครงาน</button>
            </div>
          </div>
        `).join("")}
      </div>`);
  }

  // Favorites screen
  if(sc==="favorites"){
    const favJobs=jobsData.filter(j=>isFav(j.id));
    return layout("student",`
      <div class="match-header">
        <h3>❤️ รายการโปรดของคุณ</h3>
        <p>ประกาศงานที่คุณบันทึกไว้ (${favJobs.length} รายการ)</p>
      </div>
      ${favJobs.length===0?`<div style="text-align:center;padding:40px;color:var(--muted)"><div style="font-size:40px;margin-bottom:12px">🤍</div><p>ยังไม่มีรายการโปรด กดหัวใจที่ประกาศงานเพื่อบันทึก</p></div>`:""}
      <div class="grid" style="gap:14px">
        ${favJobs.map(job=>`
          <div class="match-job-card">
            <div class="rank-circle rank-other">❤️</div>
            <div>
              <h3 style="margin:0 0 2px;font-size:15px;color:var(--navy)">${job.title}</h3>
              <p class="small" style="margin:0 0 4px">${job.company} · 📍 ${job.location}</p>
              <div class="tagbar" style="margin-top:6px">${job.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
            </div>
            <div class="match-btn-col">
              <button class="fav-btn active" onclick="toggleFavorite('${job.id}',event)">❤️ ลบออก</button>
              <button class="secondary" onclick="openJobDetail('${job.id}')">ดูรายละเอียด</button>
              <button class="primary" onclick="openApplyForm('${job.id}')">สมัครงาน</button>
            </div>
          </div>
        `).join("")}
      </div>`);
  }

  // Applications screen
  if(sc==="applications"){
    return layout("student",`
      <div class="match-header">
        <h3>รายการสมัครงานของคุณ</h3>
        <p>ติดตามสถานะการสมัครงานของคุณได้ที่นี่</p>
      </div>
      ${state.applications.length===0?`<div style="text-align:center;padding:40px;color:var(--muted)"><div style="font-size:40px;margin-bottom:12px">📋</div><p>ยังไม่ได้สมัครงานใด</p></div>`:""}
      <div class="grid" style="gap:14px">
        ${state.applications.map(app=>{
          const job=jobsData.find(j=>j.id===app.jobId);
          if(!job)return"";
          const chipClass=statusChipClass(app.status);
          const statusIcon=app.status==="ผ่านการสมัคร"?"":app.status==="ไม่ผ่านการสมัคร"?"❌":app.status==="อ่านแล้ว"?"":"";
          return `
            <div class="post-card" style="cursor:pointer" onclick="openAppliedJobDetail('${app.jobId}')">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
                <div>
                  <h3 style="margin:0 0 3px;color:var(--navy);font-size:15px">${job.title}</h3>
                  <p class="small" style="margin:0">${job.company} · 📍 ${job.location}</p>
                </div>
                <span class="status-chip ${chipClass}">${statusIcon} ${statusLabel(app.status)}</span>
              </div>
              <div class="tagbar" style="margin-bottom:8px">${job.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
              <p style="font-size:12px;color:var(--muted);margin:0">สมัครเมื่อ: ${app.appliedAt} · คลิกเพื่อดูรายละเอียดและสถานะ</p>
            </div>`;
        }).join("")}
      </div>`);
  }

  // Job Board (all jobs, like general view but with fav + apply)
  if(sc==="jobboard"){
    return layout("student",`
      <div class="match-header">
        <h3>ประกาศงานทั้งหมด</h3>
        <p>รายการประกาศงานทั้งหมดในระบบ DEK INTERN</p>
      </div>
      <div class="grid" style="gap:14px">
        ${jobsData.map(job=>`
          <div class="gen-job-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div>
                <h3>${job.title}</h3>
                <p class="small" style="margin:0">${job.company} · 📍 ${job.location}</p>
              </div>
              <button class="fav-btn ${isFav(job.id)?"active":""}" onclick="toggleFavorite('${job.id}',event)">${isFav(job.id)?"❤️":"🤍"}</button>
            </div>
            <div class="tagbar" style="margin-bottom:10px">${job.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
            <div style="display:flex;gap:8px">
              <button class="secondary" style="flex:1" onclick="openJobDetail('${job.id}')">ดูรายละเอียด</button>
              <button class="primary" style="flex:1" onclick="openApplyForm('${job.id}')">สมัครงาน</button>
            </div>
          </div>
        `).join("")}
      </div>`);
  }
}

/* ========== Open applied job with status ========== */
function openAppliedJobDetail(jobId){
  const app=state.applications.find(a=>a.jobId===jobId);
  const job=jobsData.find(j=>j.id===jobId);
  if(!job||!app)return;
  const d=job.detail;
  const chipClass=statusChipClass(app.status);
  const statusSteps=[
    {label:"ส่งใบสมัคร",done:true},
    {label:"สถานประกอบการอ่านแล้ว",done:app.status==="อ่านแล้ว"||app.status==="ผ่านการสมัคร"||app.status==="ไม่ผ่านการสมัคร"},
    {label:"ผ่านการสมัคร",done:app.status==="ผ่านการสมัคร"},
    {label:"ไม่ผ่านการสมัคร",done:app.status==="ไม่ผ่านการสมัคร"}
  ];
  const stepsHtml=`<div style="display:flex;gap:0;margin:14px 0;flex-wrap:wrap;gap:6px">
    ${statusSteps.map(s=>`<span style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:800;${s.done?"background:#dcfce7;color:#15803d;border:1px solid #bbf7d0":"background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0"}">${s.done?"✅":"⬜"} ${s.label}</span>`).join("")}
  </div>`;

  document.getElementById("jobDetailContent").innerHTML=`
    <div class="job-detail-header">
      <p style="margin:0 0 6px;font-size:12px;color:#bfdbfe">📋 ประกาศรับสมัครงาน</p>
      <h3 style="margin:0 0 4px;font-size:20px">${job.title}</h3>
      <p style="margin:0 0 4px;font-size:13px;color:#bfdbfe">${job.dept}</p>
      <p style="margin:0;font-size:12px;color:#93c5fd">🏢 ${job.company}</p>
    </div>
    <div style="background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:14px;margin-bottom:16px">
      <p style="font-weight:800;color:var(--navy);margin:0 0 8px;font-size:14px">📊 สถานะการสมัครของคุณ</p>
      <span class="status-chip ${chipClass}" style="font-size:13px;padding:6px 14px">${statusLabel(app.status)}</span>
      ${stepsHtml}
      <p style="font-size:12px;color:var(--muted);margin:0">สมัครเมื่อ: ${app.appliedAt}</p>
    </div>
    <div class="job-detail-section"><h4>📍 สถานที่ปฏิบัติงาน</h4><p>${d.locationFull}</p></div>
    <div class="job-detail-section"><h4>💰 เงินเดือน</h4><span class="salary-badge">${job.salary}</span></div>
    <div class="job-detail-section"><h4>🛠️ หน้าที่ความรับผิดชอบ</h4><ul>${d.responsibilities.map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="job-detail-section"><h4>📞 ติดต่อ</h4><div class="contact-box"><p>👤 ${d.contact.name} · 📞 ${d.contact.phone} · 📧 ${d.contact.email}</p></div></div>
    <div style="margin-top:16px"><button class="ghost" style="width:100%" onclick="closeModal('jobDetailModal')">ปิด</button></div>`;
  openModal("jobDetailModal");
}

