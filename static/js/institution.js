/* ========== Institution View ========== */
function institutionProfilePage(){
  const editing=state.institutionProfileEditing;
  return `<div class="card" style="max-width:760px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:18px">
      <div><h3>ประวัติส่วนตัวอาจารย์</h3><p class="small" style="margin:0">ข้อมูลผู้ดูแลการฝึกงานของสถาบันการศึกษา</p></div>
      <button class="${editing?"ghost":"primary"}" onclick="state.institutionProfileEditing=!state.institutionProfileEditing;render()">${editing?"ยกเลิก":"แก้ไขข้อมูล"}</button>
    </div>
    ${editing?`<div class="profile-edit-grid">
      <div><label>ชื่อ</label><input value="ดร.กานดา"></div><div><label>นามสกุล</label><input value="สมชาย"></div>
      <div><label>รหัสประจำตัวอาจารย์</label><input value="T-ENG-0248"></div><div><label>ตำแหน่ง</label><input value="อาจารย์ประจำภาควิชา"></div>
      <div><label>คณะ/ภาควิชา</label><input value="วิศวกรรมศาสตร์ / วิศวกรรมคอมพิวเตอร์"></div><div><label>เบอร์โทรศัพท์</label><input value="02-123-4567 ต่อ 204"></div>
    </div><div class="profile-edit-full"><label>อีเมล</label><input type="email" value="kanda.s@university.ac.th"></div>
    <div class="actions"><button class="primary" onclick="state.institutionProfileEditing=false;notify('บันทึกข้อมูลส่วนตัวอาจารย์แล้ว');render()">บันทึกการแก้ไข</button></div>`:
    `<div class="profile-fields-grid">
      <div class="profile-field-box"><p class="profile-field-label">ชื่อ-นามสกุล</p><p class="profile-field-value">ดร.กานดา สมชาย</p></div>
      <div class="profile-field-box"><p class="profile-field-label">รหัสประจำตัว</p><p class="profile-field-value">T-ENG-0248</p></div>
      <div class="profile-field-box"><p class="profile-field-label">ตำแหน่ง</p><p class="profile-field-value">อาจารย์ประจำภาควิชา</p></div>
      <div class="profile-field-box"><p class="profile-field-label">คณะ / ภาควิชา</p><p class="profile-field-value">วิศวกรรมศาสตร์ / วิศวกรรมคอมพิวเตอร์</p></div>
      <div class="profile-field-box"><p class="profile-field-label">อีเมล</p><p class="profile-field-value">kanda.s@university.ac.th</p></div>
      <div class="profile-field-box"><p class="profile-field-label">เบอร์โทรศัพท์</p><p class="profile-field-value">02-123-4567 ต่อ 204</p></div>
    </div>`}
  </div>`;
}
const institutionStatusStudents={
  accepted:[
    {name:"Kanda Somchai",id:"65123401",company:"Future Digital Co., Ltd.",position:"Frontend Developer Intern"},
    {name:"Narin Phan",id:"65123418",company:"AutoParts Tech Co., Ltd.",position:"Measurement Engineer Intern"}
  ],
  notAccepted:[
    {name:"Pimchanok Saelim",id:"65123427",company:"-",position:"กำลังหาสถานประกอบการ"},
    {name:"Thanawat Chaiyo",id:"65123436",company:"-",position:"กำลังหาสถานประกอบการ"}
  ],
  interview:[
    {name:"Chanon Wattanakul",id:"65123445",company:"Digital Solutions Co., Ltd.",position:"Full-Stack Developer Intern"},
    {name:"Sirinapa Kittikul",id:"65123452",company:"Future Digital Co., Ltd.",position:"UX/UI Designer Intern"}
  ]
};
const institutionVerifyRequests=[
  {id:"req1",name:"Kanda Somchai",studentId:"65123401",skill:"Programming",detail:"ขอรับรองทักษะการพัฒนาเว็บแอปพลิเคชันด้วย React และ JavaScript",evidence:"Senior project repository, Web App assignment, Git activity"},
  {id:"req2",name:"Narin Phan",studentId:"65123418",skill:"Language",detail:"ขอรับรองทักษะภาษาอังกฤษเพื่อการสื่อสารและนำเสนอผลงาน",evidence:"Presentation rubric, English course certificate"}
];
function openInstitutionStatus(status){
  const titles={accepted:"นักศึกษาที่ได้รับเข้าฝึกงาน",notAccepted:"นักศึกษาที่ยังไม่ได้รับเข้าฝึกงาน",interview:"นักศึกษาที่รอสัมภาษณ์"};
  const students=institutionStatusStudents[status]||[];
  document.getElementById("institutionDetailContent").innerHTML=`<h2>${titles[status]}</h2><p class="modal-sub">รายชื่อนักศึกษาและรายละเอียดสถานที่ฝึกงาน</p>
    <div class="grid">${students.map(s=>`<article class="student-row"><div><h3>${s.name}</h3><p class="small" style="margin:0 0 3px">รหัสนักศึกษา: <strong>${s.id}</strong></p><p class="small" style="margin:0">สถานประกอบการ: <strong>${s.company}</strong> · ตำแหน่ง: <strong>${s.position}</strong></p></div></article>`).join("")}</div>`;
  openModal("institutionDetailModal");
}
function openInstitutionVerifyDetail(requestId){
  const request=institutionVerifyRequests.find(item=>item.id===requestId); if(!request)return;
  document.getElementById("institutionDetailContent").innerHTML=`<h2>รายละเอียดคำขออนุมัติทักษะ</h2><p class="modal-sub">ตรวจสอบข้อมูลนักศึกษาและหลักฐานก่อนอนุมัติ</p>
    <div class="profile-fields-grid"><div class="profile-field-box"><p class="profile-field-label">ชื่อนักศึกษา</p><p class="profile-field-value">${request.name}</p></div><div class="profile-field-box"><p class="profile-field-label">รหัสนักศึกษา</p><p class="profile-field-value">${request.studentId}</p></div><div class="profile-field-box"><p class="profile-field-label">ทักษะที่ขออนุมัติ</p><p class="profile-field-value">${request.skill}</p></div><div class="profile-field-box"><p class="profile-field-label">สถานะ</p><p class="profile-field-value">รอตรวจสอบ</p></div></div>
    <div class="job-detail-section"><h4>รายละเอียดคำขอ</h4><p>${request.detail}</p></div><div class="job-detail-section"><h4>หลักฐานประกอบ</h4><p>${request.evidence}</p></div>
    <div class="actions"><button class="success" onclick="closeModal('institutionDetailModal');notify('อนุมัติทักษะ ${request.skill} ให้ ${request.name} แล้ว')">อนุมัติ</button><button class="danger" onclick="closeModal('institutionDetailModal');notify('ปัดตกคำขอ Verify แล้ว')">ปัดตก</button></div>`;
  openModal("institutionDetailModal");
}
function institutionView(){
  if(state.screen.institution==="profile") return layout("institution",institutionProfilePage());
  const metrics=[
    {key:"accepted",count:42,label:"นักศึกษาที่ได้รับเข้าฝึกงาน",width:"70%",color:"var(--green)"},
    {key:"notAccepted",count:18,label:"นักศึกษาที่ยังไม่ได้รับเข้าฝึกงาน",width:"30%",color:"var(--amber)"},
    {key:"interview",count:7,label:"นักศึกษาที่รอสัมภาษณ์",width:"12%",color:"#7c3aed"}
  ];
  return layout("institution",`<div class="match-header"><h3>Dashboard</h3><p>ภาพรวมสถานะนักศึกษาฝึกงานและคำขอยืนยันทักษะ</p></div>
    <div class="grid three" style="margin-bottom:22px">${metrics.map(m=>`<button class="metric dashboard-metric" onclick="openInstitutionStatus('${m.key}')" title="ดูรายชื่อนักศึกษา"><strong>${m.count}</strong><span>${m.label}</span><div class="bar"><span style="width:${m.width};background:${m.color}"></span></div><p class="small" style="margin:8px 0 0">คลิกเพื่อดูรายชื่อ</p></button>`).join("")}</div>
    <div><h3 style="margin:0 0 10px;color:var(--navy)">คำขออนุมัติทักษะ (Skill Verification)</h3><p class="small" style="margin:0 0 14px">รายชื่อนักศึกษาที่ส่งคำขอให้สถาบันตรวจสอบทักษะ</p>
      <div class="grid">${institutionVerifyRequests.map(request=>`<article class="verify-row"><div><h3>${request.name} ขอ Verify: ${request.skill}</h3><p class="small">รหัสนักศึกษา: ${request.studentId} · หลักฐาน: ${request.evidence}</p><span class="badge">${request.id==="req1"?(state.pendingSkill?"Pending":"Processed"):"Pending"}</span></div><div class="actions"><button class="secondary" onclick="openInstitutionVerifyDetail('${request.id}')">ดูรายละเอียด</button><button class="success" onclick="state.pendingSkill=false;notify('อนุมัติ Verified Badge ให้ ${request.skill} แล้ว');render()">อนุมัติ</button><button class="danger" onclick="state.pendingSkill=false;notify('ปัดตกคำขอ Verify แล้ว');render()">ปัดตก</button></div></article>`).join("")}</div>
    </div>`);
}

