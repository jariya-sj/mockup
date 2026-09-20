/* ========== Enterprise View ========== */
function enterpriseView(){
  const sc=state.screen.enterprise;

  if(sc==="profile") return layout("enterprise",enterpriseProfilePage());

  // My Posts list (default screen)
  if(sc==="myPosts"){
    if(state.showPostJobForm){
      const post=enterprisePostsData.find(item=>item.id===state.editingPostId);
      return layout("enterprise",renderPostJobForm(post));
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
            <button class="ghost" onclick="editJobPost('${ep.id}')">แก้ไข</button>
            <button class="danger" onclick="deleteJobPost('${ep.id}')">ลบ</button>
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
function hidePostJobFormFn(){state.showPostJobForm=false;state.editingPostId=null;render();}
async function loadEnterprisePosts(){
  try{const response=await fetch("/api/enterprise/posts/");const result=await response.json();result.posts.forEach(post=>{if(!enterprisePostsData.some(item=>item.id===post.id)){enterprisePostsData.unshift(post);addDatabaseJob(post);}});}catch(error){console.error(error);}
}
function addDatabaseJob(post){
  if(jobsData.some(job=>job.id===post.jobId))return;
  jobsData.unshift({id:post.jobId,title:post.title,dept:`แผนก: ${post.department}`,company:post.company,tags:post.skills,salary:post.salary,location:post.location,newGrad:true,postedAt:post.postedAt,detail:{notice:post.description,locationFull:post.location,benefits:post.benefits.split(",").map(x=>x.trim()).filter(Boolean),workHours:post.workHours,responsibilities:[post.description],requirements:post.requirements.split("\n").filter(Boolean),extra:`จำนวนที่รับ ${post.openings} คน`,note:"",contact:{name:state.enterpriseProfile.name,phone:state.enterpriseProfile.phone,line:"-",email:state.enterpriseProfile.email}}});
}

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
function renderPostJobForm(post=null){
  const value=(field,fallback)=>post?.[field] ?? fallback;
  postJobSelectedSkills=new Set(value("skills",["React","JavaScript","UI/UX Design"]));
  setTimeout(()=>renderSkillCheckboxes(),0);
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <h3 style="margin:0">${post?"แก้ไขประกาศงาน":"โพสประกาศงาน"}</h3>
      <button class="ghost" onclick="hidePostJobFormFn()">← กลับรายการ</button>
    </div>
    <div class="grid two">
      <div><label>ชื่อตำแหน่ง</label><input id="postTitle" value="${value("title","Frontend Developer Intern")}" required></div>
      <div><label>จำนวนที่รับ</label><input id="postOpenings" type="number" min="1" value="${value("openings",3)}" required></div>
    </div>
    <label>แผนก/ฝ่าย</label><input id="postDepartment" value="${value("department","Software Engineering")}" required>
    <label>ทักษะที่ต้องการ</label>
    <div id="postJobSkillPicker" style="border:1px solid #cbd5e1;border-radius:8px;padding:12px;background:#f8fafc;margin-bottom:4px"></div>
    <p style="font-size:11px;color:var(--muted);margin:0 0 8px">คลิกเพื่อเลือก/ยกเลิก ทักษะที่ต้องการจากผู้สมัคร</p>
    <label>รายละเอียดงาน</label><textarea id="postDescription" required>${value("description","พัฒนาเว็บแอปพลิเคชัน ทำงานร่วมกับทีม Product และ Mentor")}</textarea>
    <div class="grid two">
      <div><label>เงินเดือน</label><input id="postSalary" value="${value("salary","15,000 - 20,000 บาท")}"></div>
      <div><label>สถานที่ทำงาน</label><input id="postLocation" value="${value("location","กรุงเทพฯ (Hybrid)")}" required></div>
    </div>
    <label>เวลาทำงาน</label><input id="postWorkHours" value="${value("workHours","09:00-18:00 น. จ.-ศ.")}" required>
    <label>คุณสมบัติผู้สมัคร</label><textarea id="postRequirements" required>${value("requirements","ปริญญาตรี CS หรือที่เกี่ยวข้อง\nมีความรู้ React/Vue.js\nสามารถทำงานเป็นทีมได้ดี")}</textarea>
    <label>สวัสดิการ</label><input id="postBenefits" value="${value("benefits","ประกันสุขภาพ, โบนัส, WFH Allowance")}">
    <div class="actions">
      <button class="primary" id="savePostButton" onclick="saveJobPost()">${post?"บันทึกการแก้ไข":"บันทึกประกาศงาน"}</button>
      <button class="ghost" onclick="hidePostJobFormFn()">ยกเลิก</button>
    </div>
  </div>`;
}
function editJobPost(postId){
  const post=enterprisePostsData.find(item=>item.id===postId);
  if(!post)return;
  state.editingPostId=postId;
  state.showPostJobForm=true;
  render();
}
async function saveJobPost(){
  const value=id=>document.getElementById(id).value.trim();
  const payload={title:value("postTitle"),openings:value("postOpenings"),department:value("postDepartment"),skills:[...postJobSelectedSkills],description:value("postDescription"),salary:value("postSalary"),location:value("postLocation"),work_hours:value("postWorkHours"),requirements:value("postRequirements"),benefits:value("postBenefits")};
  if([payload.title,payload.openings,payload.department,payload.description,payload.location,payload.work_hours,payload.requirements].some(v=>!v)){notify("กรุณากรอกข้อมูลประกาศให้ครบ");return;}
  const button=document.getElementById("savePostButton");button.disabled=true;button.textContent="กำลังบันทึก...";
  const postId=state.editingPostId;
  const isMockPost = typeof postId === "string" && !postId.startsWith("db-");
  if(isMockPost){
    const currentIndex=enterprisePostsData.findIndex(item=>item.id===postId || item.jobId===postId);
    const nextPost={
      id: postId || `ep${Date.now()}`,
      jobId: postId ? (enterprisePostsData.find(item=>item.id===postId || item.jobId===postId)?.jobId || `job${Date.now()}`) : `job${Date.now()}`,
      title: payload.title,
      applicants: currentIndex>=0 ? enterprisePostsData[currentIndex].applicants : 0,
      status: "active",
      postedAt: new Date().toISOString().slice(0,10),
      department: payload.department,
      skills: payload.skills,
      description: payload.description,
      salary: payload.salary,
      location: payload.location,
      workHours: payload.work_hours,
      requirements: payload.requirements,
      benefits: payload.benefits,
      openings: Number(payload.openings)
    };
    if(currentIndex>=0){
      enterprisePostsData[currentIndex]={...enterprisePostsData[currentIndex],...nextPost};
    }else{
      enterprisePostsData.unshift(nextPost);
    }
    const jobIndex=jobsData.findIndex(job=>job.id===nextPost.jobId || job.id===postId);
    const jobDetail={notice:payload.description,locationFull:payload.location,benefits:(payload.benefits||"").split(",").map(x=>x.trim()).filter(Boolean),workHours:payload.work_hours,responsibilities:[payload.description],requirements:(payload.requirements||"\n").split("\n").filter(Boolean),extra:`จำนวนที่รับ ${payload.openings} คน`,note:"",contact:{name:state.enterpriseProfile.name,phone:state.enterpriseProfile.phone,line:"-",email:state.enterpriseProfile.email}};
    if(jobIndex>=0){
      jobsData[jobIndex]={...jobsData[jobIndex],title:payload.title,dept:`แผนก: ${payload.department}`,tags:payload.skills,salary:payload.salary,location:payload.location,postedAt:nextPost.postedAt,detail:jobDetail};
    }else{
      jobsData.unshift({id:nextPost.jobId,title:payload.title,dept:`แผนก: ${payload.department}`,company:state.enterpriseProfile.company,tags:payload.skills,salary:payload.salary,location:payload.location,newGrad:true,postedAt:nextPost.postedAt,detail:jobDetail});
    }
    state.showPostJobForm=false;state.editingPostId=null;notify(postId?"แก้ไขประกาศงานแล้ว":"บันทึกประกาศงานแล้ว");render();
    button.disabled=false;button.textContent=postId?"บันทึกการแก้ไข":"บันทึกประกาศงาน";
    return;
  }
  const url=postId?`/api/enterprise/posts/${postId}/`:"/api/enterprise/posts/";
  const method=postId?"PUT":"POST";
  const headers={"Content-Type":"application/json"};
  const csrfToken=window.getCsrfToken ? window.getCsrfToken() : "";
  if(csrfToken){headers["X-CSRFToken"]=csrfToken;}
  try{const response=await fetch(url,{method,headers,body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw new Error(result.error||"บันทึกไม่สำเร็จ");
    if(postId){const index=enterprisePostsData.findIndex(item=>item.id===postId || item.jobId===postId);enterprisePostsData[index]={...enterprisePostsData[index],...result.post};updateDatabaseJob(result.post);}
    else{enterprisePostsData.unshift(result.post);addDatabaseJob(result.post);}
    state.showPostJobForm=false;state.editingPostId=null;notify(postId?"แก้ไขประกาศงานแล้ว":"บันทึกประกาศงานแล้ว");render();
  }catch(error){notify(error.message);button.disabled=false;button.textContent=postId?"บันทึกการแก้ไข":"บันทึกประกาศงาน";}
}
function updateDatabaseJob(post){
  const job=jobsData.find(item=>item.id===post.jobId);
  if(!job){addDatabaseJob(post);return;}
  Object.assign(job,{title:post.title,dept:`แผนก: ${post.department}`,tags:post.skills,salary:post.salary,location:post.location,postedAt:post.postedAt});
  job.detail={...job.detail,notice:post.description,locationFull:post.location,benefits:post.benefits.split(",").map(item=>item.trim()).filter(Boolean),workHours:post.workHours,responsibilities:[post.description],requirements:post.requirements.split("\n").filter(Boolean),extra:`จำนวนที่รับ ${post.openings} คน`};
}
async function deleteJobPost(postId){
  const post=enterprisePostsData.find(item=>item.id===postId || item.jobId===postId);
  if(!post||!window.confirm(`ยืนยันการลบประกาศ "${post.title}" หรือไม่`))return;
  const isMockPost = typeof postId === "string" && !postId.startsWith("db-");
  if(isMockPost){
    const index=enterprisePostsData.findIndex(item=>item.id===postId || item.jobId===postId);
    if(index>=0) enterprisePostsData.splice(index,1);
    const jobIndex=jobsData.findIndex(item=>item.id===post.jobId || item.id===postId);
    if(jobIndex>=0) jobsData.splice(jobIndex,1);
    notify("ลบประกาศงานแล้ว");
    render();
    return;
  }
  const csrfToken=window.getCsrfToken ? window.getCsrfToken() : "";
  const headers={};
  if(csrfToken){headers["X-CSRFToken"]=csrfToken;}
  try{const response=await fetch(`/api/enterprise/posts/${postId}/`,{method:"DELETE",headers});const result=await response.json();if(!response.ok)throw new Error(result.error||"ลบประกาศไม่สำเร็จ");
    const index=enterprisePostsData.findIndex(item=>item.id===postId || item.jobId===postId);enterprisePostsData.splice(index,1);const jobIndex=jobsData.findIndex(item=>item.id===post.jobId || item.id===postId);if(jobIndex>=0)jobsData.splice(jobIndex,1);notify("ลบประกาศงานแล้ว");render();
  }catch(error){notify(error.message);}
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

