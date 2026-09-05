/* ========== Enterprise View ========== */
function enterpriseView(){
  const sc=state.screen.enterprise;

  if(sc==="profile") return layout("enterprise",enterpriseProfilePage());

  // My Posts list (default screen)
  if(sc==="myPosts"){
    if(state.showPostJobForm){
      return layout("enterprise",renderPostJobForm());
    }
    const postsHtml=enterprisePostsData.map(ep=>{
      const isSuc=ep.status==="สำเร็จ";
      return `
        <div class="post-card">
          ${isSuc?`<span class="success-label">สำเร็จ</span>`:""}
          <div class="post-card-header">
            <div>
              <h3>${ep.title}</h3>
              <p class="small" style="margin:4px 0 0"> โพสเมื่อ: ${ep.postedAt} · ผู้สมัคร: ${ep.applicants} คน</p>
            </div>
          </div>
          <div class="tagbar" style="margin-bottom:10px">
            <span class="badge ${isSuc?"success-badge":""}">${isSuc?"รับนักศึกษาแล้ว":"🟢 กำลังรับสมัคร"}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="secondary" onclick="openJobDetail('${ep.jobId}')">ดูประกาศ</button>
            <button class="primary" onclick="openSmartRanking('${ep.id}')">Smart Ranking</button>
            <button class="ghost" onclick="openAllApplicants('${ep.id}')">ผู้สมัครทั้งหมด</button>
          </div>
        </div>`;
    }).join("");
    return layout("enterprise",`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div>
          <h3 style="margin:0 0 3px;color:var(--navy)">ประกาศงานของคุณ</h3>
          <p class="small" style="margin:0">รายการประกาศงานทั้งหมดที่คุณโพสไว้</p>
        </div>
        <button class="primary" onclick="showPostJobFormFn()">+ โพสประกาศงาน</button>
      </div>
      <div class="grid" style="gap:14px">${postsHtml}</div>`);
  }

  // Smart Ranking screen (shown via sidebar)
  if(sc==="ranking"){
    return layout("enterprise",`
      <div class="match-header">
        <h3>Smart Ranking</h3>
        <p>เลือกประกาศงานเพื่อดูนักศึกษาที่แนะนำ</p>
      </div>
      <div class="grid" style="gap:10px">
        ${enterprisePostsData.map(ep=>`
          <div style="border:1px solid var(--line);border-radius:8px;padding:14px;display:flex;justify-content:space-between;align-items:center;background:white">
            <div><strong style="color:var(--navy)">${ep.title}</strong><p class="small" style="margin:4px 0 0">${ep.applicants} ผู้สมัคร</p></div>
            <button class="primary" onclick="openSmartRanking('${ep.id}')">ดู Smart Ranking</button>
          </div>`).join("")}
      </div>`);
  }
}

function showPostJobFormFn(){state.showPostJobForm=true;render();}
function hidePostJobFormFn(){state.showPostJobForm=false;render();}

const postJobSkillOptions={
  technical:["Python","JavaScript","HTML","CSS","SQL","React","Node.js","Java","C/C++","Git","TypeScript","PHP","MongoDB","Docker","UI/UX Design","Power BI","Excel","Machine Learning"],
  soft:["การสื่อสาร","การทำงานเป็นทีม","การบริหารเวลา","การปรับตัว","ภาวะผู้นำ","การนำเสนอ","ควบคุมอารมณ์ได้ดี","มนุษยสัมพันธ์"],
  cognitive:["การคิดวิเคราะห์","การแก้ปัญหา","การตัดสินใจ","การเรียนรู้เร็ว","การคิดเชิงระบบ","การวางแผน"]
};
let postJobSelectedSkills=new Set(["React","JavaScript","UI/UX Design"]);
function togglePostSkill(skill){
  if(postJobSelectedSkills.has(skill)){postJobSelectedSkills.delete(skill);}
  else{postJobSelectedSkills.add(skill);}
  renderSkillCheckboxes();
}
function renderSkillCheckboxes(){
  const categories=[
    {key:"technical",label:"Technical Skill",color:"#eff6ff",border:"#bfdbfe",text:"#1d4ed8"},
    {key:"soft",label:"Soft Skill",color:"#f0fdf4",border:"#bbf7d0",text:"#15803d"},
    {key:"cognitive",label:"Cognitive Skill",color:"#faf5ff",border:"#d8b4fe",text:"#7c3aed"}
  ];
  const el=document.getElementById("postJobSkillPicker");
  if(!el)return;
  el.innerHTML=categories.map(cat=>{
    const opts=postJobSkillOptions[cat.key].map(opt=>{
      const sel=postJobSelectedSkills.has(opt);
      return `<button type="button" onclick="togglePostSkill('${opt}')" style="display:inline-flex;align-items:center;gap:4px;border-radius:999px;padding:5px 11px;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;border:1.5px solid ${sel?cat.border:"#d1d5db"};background:${sel?cat.color:"#f9fafb"};color:${sel?cat.text:"#9ca3af"};">${sel?"✓ ":"+"}${opt}</button>`;
    }).join("");
    return `<div style="margin-bottom:10px"><p style="font-size:12px;font-weight:800;color:#334155;margin:0 0 6px">${cat.label}</p><div style="display:flex;flex-wrap:wrap;gap:6px">${opts}</div></div>`;
  }).join("");
}
function renderPostJobForm(){
  setTimeout(()=>renderSkillCheckboxes(),0);
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <h3 style="margin:0">โพสประกาศงาน</h3>
      <button class="ghost" onclick="hidePostJobFormFn()">← กลับรายการ</button>
    </div>
    <div class="grid two">
      <div><label>ชื่อตำแหน่ง</label><input value="Frontend Developer Intern"></div>
      <div><label>จำนวนที่รับ</label><input value="3"></div>
    </div>
    <label>แผนก/ฝ่าย</label><input value="Software Engineering">
    <label>ทักษะที่ต้องการ</label>
    <div id="postJobSkillPicker" style="border:1px solid #cbd5e1;border-radius:8px;padding:12px;background:#f8fafc;margin-bottom:4px"></div>
    <p style="font-size:11px;color:var(--muted);margin:0 0 8px">คลิกเพื่อเลือก/ยกเลิก ทักษะที่ต้องการจากผู้สมัคร</p>
    <label>รายละเอียดงาน</label><textarea>พัฒนาเว็บแอปพลิเคชัน ทำงานร่วมกับทีม Product และ Mentor</textarea>
    <div class="grid two">
      <div><label>เงินเดือน</label><input value="15,000 - 20,000 บาท"></div>
      <div><label>สถานที่ทำงาน</label><input value="กรุงเทพฯ (Hybrid)"></div>
    </div>
    <label>เวลาทำงาน</label><input value="09:00-18:00 น. จ.-ศ.">
    <label>คุณสมบัติผู้สมัคร</label><textarea>ปริญญาตรี CS หรือที่เกี่ยวข้อง&#10;มีความรู้ React/Vue.js&#10;สามารถทำงานเป็นทีมได้ดี</textarea>
    <label>สวัสดิการ</label><input value="ประกันสุขภาพ, โบนัส, WFH Allowance">
    <div class="actions">
      <button class="primary" onclick="notify('บันทึกประกาศงานแล้ว');hidePostJobFormFn()">บันทึกประกาศงาน</button>
      <button class="ghost" onclick="hidePostJobFormFn()">ยกเลิก</button>
    </div>
  </div>`;
}

/* ========== Smart Ranking Modal ========== */
function openAllApplicants(postId){
  const post=enterprisePostsData.find(p=>p.id===postId);
  if(!post)return;
  const html=`<h2 style="margin:0 0 4px;color:var(--navy)">ผู้สมัครทั้งหมด</h2>
    <p class="modal-sub" style="margin-bottom:18px">ตำแหน่ง: <strong>${post.title}</strong> — แสดงรายชื่อผู้สมัครโดยไม่มีการจัดอันดับ</p>
    ${smartStudents.map(s=>`<div class="sr-student-card">
      <div class="sr-avatar">${s.initial}</div>
      <div class="sr-info"><strong>${s.name}</strong><span> ${s.university} · ${s.major} · GPA ${s.gpa}</span><div class="tagbar" style="margin-top:6px">${s.skills.map(sk=>`<span class="tag">${sk}</span>`).join("")}</div></div>
      <div class="sr-actions"><button class="secondary" onclick="openResumeModal('${s.id}')">ดูประวัติส่วนตัว</button><button class="success" onclick="acceptStudent('${s.id}','${s.name}')">✅ รับเข้าฝึกงาน</button></div>
    </div>`).join("")}
    <p class="small" style="margin:14px 0 0">ตัวอย่างรายชื่อผู้สมัคร ${smartStudents.length} คน จากทั้งหมด ${post.applicants} คน</p>`;
  document.getElementById("allApplicantsContent").innerHTML=html;
  openModal("allApplicantsModal");
}
function openSmartRanking(postId){
  const post=enterprisePostsData.find(p=>p.id===postId);
  if(!post)return;
  state.currentSmartRankPostId=postId;
  const rankClass=i=>i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"rank-other";
  const html=`
    <h2 style="margin:0 0 4px;color:var(--navy)">Smart Ranking</h2>
    <p class="modal-sub" style="margin-bottom:18px">ตำแหน่ง: <strong>${post.title}</strong> — นักศึกษาที่แนะนำโดย AI</p>
    ${smartStudents.map((s,i)=>`
      <div class="sr-student-card">
        <div style="position:relative">
          <div class="sr-avatar">${s.initial}</div>
          <div class="rank-circle ${rankClass(i)}" style="width:22px;height:22px;font-size:11px;position:absolute;top:-6px;right:-6px">#${i+1}</div>
        </div>
        <div class="sr-info">
          <strong>${s.name}</strong>
          <span>🏫 ${s.university} · ${s.major} · GPA ${s.gpa}</span>
          <div class="tagbar" style="margin-top:6px">${s.skills.map(sk=>`<span class="tag">${sk}</span>`).join("")}</div>
          <span class="match-score-badge" style="margin-top:6px">Match ${s.score}%</span>
        </div>
        <div class="sr-actions">
          <button class="secondary" onclick="openResumeModal('${s.id}')">อ่าน Resume</button>
          <button class="success" onclick="acceptStudent('${s.id}','${s.name}')">รับเข้าฝึกงาน</button>
        </div>
      </div>
    `).join("")}
  `;
  document.getElementById("smartRankingContent").innerHTML=html;
  openModal("smartRankingModal");
}
function acceptStudent(sId,sName){
  notify(`รับ ${sName} เข้าฝึกงานเรียบร้อยแล้ว!`);
  closeModal("smartRankingModal");
  closeModal("allApplicantsModal");
}

/* ========== Resume Modal ========== */
function openResumeModal(sId){
  const s=smartStudents.find(x=>x.id===sId);
  if(!s)return;
  document.getElementById("resumeContent").innerHTML=`
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
      <div class="sr-avatar" style="width:60px;height:60px;font-size:22px">${s.initial}</div>
      <div>
        <h2 style="margin:0 0 3px;color:var(--navy)">${s.name}</h2>
        <p style="margin:0;font-size:13px;color:var(--muted)">🏫 ${s.university} · ${s.major} · GPA ${s.gpa}</p>
      </div>
    </div>
    <div class="job-detail-section">
      <h4>ทักษะ</h4>
      <div class="skill-badges-wrap">${s.skills.map(sk=>`<span class="skill-badge verified">✓ ${sk}</span>`).join("")}</div>
    </div>
    <div class="job-detail-section">
      <h4>การศึกษา</h4>
      <p><strong>${s.university}</strong> · สาขา ${s.major}</p>
      <p>เกรดเฉลี่ยสะสม (GPA): <strong>${s.gpa}</strong></p>
    </div>

    <div class="job-detail-section">
      <h4>รางวัลและกิจกรรม</h4>
      <p>• แข่งขัน Hackathon ระดับประเทศ — ได้รับรางวัลที่ 2</p>
      <p>• อาสาสมัครสอนคอมพิวเตอร์ชุมชน</p>
    </div>

    <a href="${s.id}.pdf"
       target="_blank"
       style="
            color:#1d4ed8;
            text-decoration:none;
            font-weight:600;
       ">
      📄 เปิดไฟล์ Resume (PDF)
    </a>

    <div class="actions">
      <button class="success" style="flex:1" onclick="acceptStudent('${s.id}','${s.name}');closeModal('resumeModal')">✅ รับเข้าฝึกงาน</button>
      <button class="ghost" onclick="closeModal('resumeModal')">ปิด</button>
    </div>`;
  openModal("resumeModal");
}

