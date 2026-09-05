/* ========== Data ========== */
const rolesData=[
  {id:"student",label:"นักศึกษา",icon:"🎓",desc:"สมัครและติดตามงานฝึกงาน"},
  {id:"enterprise",label:"สถานประกอบการ",icon:"🏢",desc:"ลงประกาศรับนักศึกษาฝึกงาน"},
  {id:"institution",label:"สถาบันการศึกษา",icon:"🏫",desc:"ตรวจสอบข้อมูลองค์กรและสถาบันการศึกษา"},
  {id:"admin",label:"ผู้ดูแลระบบ",icon:"🛡️",desc:"บริหารจัดการระบบ"}
];

const jobsData=[
  {id:"job1",title:"Measurement Engineer",dept:"แผนก: Quality Assurance (QA)",
   company:"บริษัท ออโต้พาร์ทส์ เทค จำกัด",tags:["วิศวกรรมอุตสาหการ","QA/QC","IATF 16949"],
   salary:"16,000 - 23,000 บาท",location:"นิคมฯ เกตเวย์ซิตี้ ฉะเชิงเทรา",newGrad:true,
   postedAt:"2026-07-11",
   detail:{
    notice:"ยินดีรับพิจารณาเด็กจบใหม่ที่จบตรงสาย (หากมีประสบการณ์ QC/QA มาก่อนจะพิจารณาเป็นพิเศษ)",
    locationFull:"นิคมอุตสาหกรรมเกตเวย์ซิตี้ ต.หัวสำโรง อ.แปลงยาว จ.ฉะเชิงเทรา (ผู้ผลิตชิ้นส่วนยานยนต์)",
    benefits:["โบนัสประจำปี 2 ครั้ง/ปี","ปรับขึ้นเงินเดือนประจำปี","รถรับส่ง + ยูนิฟอร์ม","ค่า OT","ค่าเบี้ยเลี้ยงอาหาร","ค่าเบี้ยเลี้ยงครองชีพ","ค่าเบี้ยเลี้ยงที่พัก","เบี้ยขยัน","กองทุนสำรองเลี้ยงชีพ","ประกันสุขภาพ OPD/IPD/ทันตกรรม/วัคซีน","เงินช่วยคลอดบุตร/แต่งงาน/งานศพ","ทริปท่องเที่ยวประจำปี","ตรวจสุขภาพประจำปี"],
    workHours:"08:00-17:00 น. จ.-ศ. (เสาร์เฉลี่ย 5 วัน/ปี)",
    responsibilities:["พัฒนาและปรับปรุงวิธีการวัดเพื่อเพิ่มความแม่นยำ","จัดทำ MSA Plan และวิเคราะห์ระบบ SPC","จัดเตรียม CF Jig และ Part Master","ตรวจสอบร่วมกับซัพพลายเออร์ ลูกค้า และทีม QA","สนับสนุน Full Layout / Special Request","ตรวจ IATF 16949 และ ISO 14001","วิเคราะห์ความเสี่ยง Turtle Chart + 6S"],
    requirements:["ปริญญาตรี วิศวกรรม (อุตสาหการ/เครื่องกล/โลหะการ)","อ่านแบบ 2D/3D + GD&T ได้","พื้นฐานเครื่องมือวัดและ CMM","ความรู้ IATF + 5 Core Tools (MSA, SPC)","สื่อสารอังกฤษได้ดี","ทำงานภายใต้ความกดดันได้"],
    extra:"เพศชาย | อายุ 22-35 ปี | แนบ Transcript",
    note:"วันสัมภาษณ์มีแบบทดสอบเทคนิค QA/QC",
    contact:{name:"คุณสมศรี",phone:"062-112-0000",line:"@12345",email:"hr.ssck.ck@gmail.com"}
   }
  },
  {id:"job2",title:"นักพัฒนาซอฟต์แวร์ (Full-Stack Developer)",dept:"แผนก: Software Engineering",
   company:"บริษัท ดิจิทัล โซลูชันส์ จำกัด",tags:["React","Node.js","PostgreSQL","TypeScript"],
   salary:"18,000 - 28,000 บาท",location:"AIA Capital Center กรุงเทพฯ (Hybrid)",newGrad:true,
   postedAt:"2026-07-10",
   detail:{
    notice:"ยินดีรับนักศึกษาฝึกงานและจบใหม่ทุกเพศ สาขา CS หรือที่เกี่ยวข้อง",
    locationFull:"อาคาร AIA Capital Center ถ.รัชดาภิเษก กรุงเทพฯ (Hybrid 3 วัน/สัปดาห์)",
    benefits:["โบนัสตามผลประกอบการ","ประกันสุขภาพกลุ่ม","WFH Allowance","MacBook","ทุนอบรม","ทริปประจำปี","ตรวจสุขภาพประจำปี"],
    workHours:"09:00-18:00 น. จ.-ศ. (Flexible)",
    responsibilities:["พัฒนา Web App Frontend + Backend","ออกแบบ REST API + DB Schema","Code Review และ Unit Test","Sprint Planning ใน Agile/Scrum","ปรับปรุง Performance และ Security"],
    requirements:["ปริญญาตรี CS / Software Eng. หรือที่เกี่ยวข้อง","JavaScript/TypeScript, React หรือ Vue","REST API + SQL/NoSQL","Git","GitHub/Portfolio จะได้รับการพิจารณาเป็นพิเศษ"],
    extra:"ทุกเพศ | อายุ 21-30 ปี",
    note:"มีแบบทดสอบ Coding Challenge",
    contact:{name:"คุณวิภาวี",phone:"02-123-4567",line:"@digitalsol",email:"recruit@digitalsol.co.th"}
   }
  },
  {id:"job3",title:"นักวิเคราะห์และออกแบบระบบงาน (System Analyst)",dept:"แผนก: IT & Digital Transformation",
   company:"บมจ. กรุงไทย ดิจิทัล จำกัด",tags:["Business Analysis","UML","SQL","Agile"],
   salary:"20,000 - 30,000 บาท",location:"ถ.สุขุมวิท กรุงเทพฯ (On-site)",newGrad:false,
   postedAt:"2026-07-08",
   detail:{
    notice:"ต้องการผู้มีประสบการณ์ IT หรือ Business Analysis อย่างน้อย 1 ปี",
    locationFull:"สำนักงานใหญ่ ถ.สุขุมวิท กรุงเทพฯ (On-site)",
    benefits:["เงินเดือน 13 เดือน","โบนัสประจำปี","กองทุนสำรองเลี้ยงชีพ","ประกันชีวิต+สุขภาพกลุ่ม","สินเชื่อพนักงาน","ทุนศึกษาต่อ","ตรวจสุขภาพประจำปี"],
    workHours:"08:30-17:30 น. จ.-ศ.",
    responsibilities:["วิเคราะห์ความต้องการธุรกิจ → IT Requirements","จัดทำ Use Case, DFD, Functional Spec","ประสานทีม Business และ Dev","ทดสอบ UAT + จัดทำ Test Case","วิเคราะห์ปัญหาและเสนอแนวทางแก้ไข"],
    requirements:["ปริญญาตรี CS / IT / สารสนเทศ","ความรู้ UML, BPMN","เขียน SQL ได้ดี","ทักษะสื่อสารและนำเสนอ","Agile/Scrum จะพิจารณาเป็นพิเศษ"],
    extra:"ทุกเพศ | อายุ 23-35 ปี | ประสบการณ์ 1 ปี+",
    note:"สัมภาษณ์ 2 รอบ (HR + Technical)",
    contact:{name:"คุณปิยะ",phone:"02-987-6543",line:"@ktbdigital",email:"hr@ktbdigital.co.th"}
   }
  },
  {id:"job4",title:"นักวิทยาศาสตร์ข้อมูล (Data Scientist)",dept:"แผนก: Data & AI",
   company:"บริษัท อินไซต์ อนาลิติกส์ จำกัด",tags:["Python","Machine Learning","SQL","Power BI"],
   salary:"22,000 - 35,000 บาท",location:"True Digital Park กรุงเทพฯ (Hybrid)",newGrad:true,
   postedAt:"2026-07-09",
   detail:{
    notice:"ยินดีรับนักศึกษาปีสุดท้ายหรือจบใหม่ที่มี Project ด้าน Data Science",
    locationFull:"True Digital Park ถ.สุขุมวิท กรุงเทพฯ (Hybrid)",
    benefits:["โบนัสตามผลงาน","ประกันสุขภาพกลุ่ม","สนับสนุน Online Course","อุปกรณ์ครบชุด","ทริปต่างประเทศประจำปี"],
    workHours:"09:00-18:00 น. จ.-ศ. (Flexible)",
    responsibilities:["วิเคราะห์ Big Data เพื่อ Business Insight","สร้างและ Deploy ML Model","พัฒนา Dashboard + Visualization","ร่วมกับทีม Product และ Engineering","SQL + Big Data Management"],
    requirements:["ปริญญาตรี/โท Data Science / Statistics / Math / CS","Python (pandas, scikit-learn)","ML/DL + Statistics","SQL ขั้นสูง","Kaggle Portfolio จะพิจารณาเป็นพิเศษ"],
    extra:"ทุกเพศ | อายุ 22-32 ปี",
    note:"มี Data Analysis Case Study",
    contact:{name:"คุณมนัส",phone:"02-345-6789",line:"@insightai",email:"talent@insightanalytics.co.th"}
   }
  }
];

/* ========== Enterprise Posts Data ========== */
 const enterprisePostsData=[
   {id:"ep1",jobId:"job2",title:"นักพัฒนาซอฟต์แวร์ (Full-Stack Developer)",applicants:12,status:"active",postedAt:"2026-07-10"},
   {id:"ep2",jobId:"job4",title:"นักวิทยาศาสตร์ข้อมูล (Data Scientist)",applicants:8,status:"active",postedAt:"2026-07-09"},
   {id:"ep3",jobId:"job1",title:"Measurement Engineer",applicants:5,status:"สำเร็จ",postedAt:"2026-06-15"}
 ];

/* ========== Smart Ranking Students ========== */
const smartStudents=[
  {id:"s1",name:"Kanda Somchai",university:"KMUTT",major:"Computer Science",gpa:"3.42",skills:["React","JavaScript","Git","English Communication"],score:96,initial:"K"},
  {id:"s2",name:"Narin Phan",university:"Chulalongkorn Univ.",major:"Information Technology",gpa:"3.28",skills:["Python","SQL","Teamwork & Agile"],score:90,initial:"N"},
  {id:"s3",name:"Pimchanok R.",university:"Kasetsart Univ.",major:"Software Engineering",gpa:"3.15",skills:["QA","Documentation","Teamwork & Agile"],score:84,initial:"P"},
  {id:"s4",name:"Thanyaluck W.",university:"KMITL",major:"Computer Engineering",gpa:"3.05",skills:["JavaScript","Node.js"],score:72,initial:"T"}
];

/* ========== Admin approval data ========== */
const adminEnterprises=[
  {id:"org1",company:"Future Digital Co., Ltd.",registration:"0105568123456",representative:"ณัฐวุฒิ เจริญผล",email:"contact@futuredigital.co.th",phone:"02-456-7890",address:"88 อาคารเอฟดี ถนนรัชดาภิเษก กรุงเทพฯ",business:"พัฒนาซอฟต์แวร์และดิจิทัลโซลูชัน",documents:"หนังสือรับรองบริษัท, ภ.พ.20 และเอกสารผู้มีอำนาจลงนาม",submitted:"10 ก.ค. 2026",status:"pending"},
  {id:"org2",company:"Green Growth Solutions จำกัด",registration:"0105569456789",representative:"พิมพ์ชนก วัฒนกุล",email:"hr@greengrowth.co.th",phone:"02-987-6543",address:"120 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ",business:"พลังงานสะอาดและที่ปรึกษาด้านสิ่งแวดล้อม",documents:"หนังสือรับรองบริษัท และเอกสารสถานที่ประกอบการ",submitted:"11 ก.ค. 2026",status:"pending"}
];
const adminTeachers=[
  {id:"teacher1",name:"ดร. อรทัย ศรีสุข",teacherId:"TCH-UBU-0142",university:"มหาวิทยาลัยอุบลราชธานี",faculty:"คณะวิทยาศาสตร์",program:"วิทยาการคอมพิวเตอร์",email:"orathai.s@ubu.ac.th",phone:"081-234-5678",position:"อาจารย์ประจำหลักสูตร",evidence:"บัตรประจำตัวบุคลากรและหนังสือรับรองจากคณะ",evidencePdf:"teacher-orathai-verification.pdf",submitted:"10 ก.ค. 2026",status:"pending"},
  {id:"teacher2",name:"อาจารย์ กิตติพงศ์ พานทอง",teacherId:"TCH-KMUTT-0286",university:"มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",faculty:"คณะเทคโนโลยีสารสนเทศ",program:"เทคโนโลยีสารสนเทศ",email:"kittipong.p@kmutt.ac.th",phone:"089-876-5432",position:"อาจารย์ผู้ประสานงานสหกิจศึกษา",evidence:"หนังสือแต่งตั้งผู้ประสานงานและบัตรบุคลากร",evidencePdf:"teacher-kittipong-verification.pdf",submitted:"11 ก.ค. 2026",status:"pending"}
];
const adminReportedPosts=[
  {id:"post1",title:"รับนักศึกษาฝึกงาน Sales ออนไลน์ รายได้สูง",company:"Bright Deal Co., Ltd.",position:"Sales Intern",location:"ทำงานจากที่บ้าน (Remote)",allowance:"รายได้ตามผลงาน",workHours:"ยืดหยุ่นตามเวลาที่ตกลง",content:"รับนักศึกษาฝึกงานขายสินค้าออนไลน์ ทำงานจากที่บ้าน รายได้ตามผลงาน สนใจติดต่อทาง LINE: fastdeal99",responsibilities:["นำเสนอสินค้าและตอบแชตลูกค้าผ่านช่องทางออนไลน์","บันทึกยอดขายและสรุปผลการทำงานรายวัน"],requirements:["กำลังศึกษาในระดับอุดมศึกษา","ใช้สื่อสังคมออนไลน์ได้คล่อง"],benefits:["ทำงานแบบ Remote","มีค่าคอมมิชชั่นตามยอดขาย"],contact:"LINE: fastdeal99",reportedReason:"ผู้ใช้งานรายงานว่าอาจเป็นประกาศชวนทำงานที่ไม่ชัดเจนและมีข้อมูลค่าตอบแทนเกินจริง",reports:[{name:"นายสมชาย ใจดี",studentId:"6711454701",reason:"บริษัทนี้ไม่มีอยู่จริง และไม่พบข้อมูลการจดทะเบียนที่ตรวจสอบได้"},{name:"นางสาวพิมพ์ชนก แสงทอง",studentId:"6711454702",reason:"ประกาศไม่ได้ระบุเบี้ยเลี้ยงหรือผู้รับผิดชอบอย่างชัดเจน"},{name:"นายณรงค์ชัย ศรีสุข",studentId:"6711454703",reason:"ถูกขอให้ติดต่อผ่าน LINE ส่วนตัวและให้โอนเงินก่อนเริ่มงาน"},{name:"นางสาวกานดา สมชาย",studentId:"6711454700",reason:"รายละเอียดตำแหน่งและหน้าที่งานไม่ชัดเจน"}],submitted:"11 ก.ค. 2026",status:"reported"},
  {id:"post2",title:"Intern Graphic Designer",company:"Creative Junction จำกัด",position:"Graphic Design Intern",location:"อาคาร Creative Hub, กรุงเทพฯ (Hybrid)",allowance:"5,000 บาท/เดือน",workHours:"จ.-ศ. 09:00-17:00 น.",content:"ร่วมออกแบบสื่อออนไลน์และสื่อสิ่งพิมพ์ ทำงานที่สำนักงาน 3 วันต่อสัปดาห์ มีพี่เลี้ยงดูแลและเบี้ยเลี้ยง 5,000 บาท/เดือน",responsibilities:["ออกแบบสื่อสำหรับโซเชียลมีเดีย","สนับสนุนทีมออกแบบในการจัดทำสื่อสิ่งพิมพ์"],requirements:["ใช้ Adobe Illustrator หรือ Photoshop ได้","มี Portfolio ผลงานออกแบบ"],benefits:["เบี้ยเลี้ยง 5,000 บาท/เดือน","มีพี่เลี้ยงดูแล"],contact:"hr@creativejunction.co.th",reportedReason:"ผู้ใช้งานรายงานว่ารายละเอียดสวัสดิการไม่ครบถ้วน",reports:[{name:"นายธนกร พูลทรัพย์",studentId:"6711454710",reason:"ต้องการให้บริษัทระบุสิทธิประโยชน์และเงื่อนไขการทำงานเพิ่มเติม"}],submitted:"10 ก.ค. 2026",status:"reported"}
];

/* ========== State ========== */
const state={
  role:"general",
  loggedIn:{student:false,enterprise:false,institution:false,admin:false},
  screen:{general:"home",student:"jobs",enterprise:"myPosts",institution:"verify",admin:"dashboard"},
  pendingSkill:true,enterpriseApproved:false,postHidden:false,institutionProfileEditing:false,adminProfileEditing:false,adminRejecting:null,
  selectedLoginRole:null,selectedRegisterType:"student",currentJobId:null,
  favorites:["job1","job2"],
  applications:[
    {jobId:"job2",appliedAt:"2026-07-10",status:"อ่านแล้ว"},
    {jobId:"job4",appliedAt:"2026-07-09",status:"ผ่านการสมัคร"}
  ],
  notifications:[
    {id:"n1",jobId:"job1",title:"📢 ประกาศใหม่! Measurement Engineer",desc:"บริษัท ออโต้พาร์ทส์ เทค จำกัด — เหมาะสำหรับคุณ",read:false,time:"เมื่อกี้"},
    {id:"n2",jobId:"job2",title:"📢 ประกาศใหม่! Full-Stack Developer",desc:"บริษัท ดิจิทัล โซลูชันส์ จำกัด — Match สูง 96%",read:false,time:"2 ชั่วโมงที่แล้ว"},
    {id:"n3",jobId:"job4",title:"📢 ประกาศใหม่! Data Scientist",desc:"บริษัท อินไซต์ อนาลิติกส์ จำกัด — Python ตรงสาย",read:true,time:"เมื่อวาน"}
  ],
  studentProfile:{
    name:"Kanda Somchai",
    studentId:"6711454700",
    university:"มหาวิทยาลัยอุบลราชธานี",
    major:"Computer Science",
    gpa:"3.42"
  },
  enterpriseProfile:{
    company:"บริษัท ดิจิทัล โซลูชันส์ จำกัด",
    name:"วิภาวี สุขใจ",
    employeeId:"EMP-2026-014",
    position:"เจ้าหน้าที่สรรหาบุคลากร",
    department:"ฝ่ายทรัพยากรบุคคล",
    phone:"02-123-4567",
    email:"recruit@digitalsol.co.th",
    address:"AIA Capital Center, กรุงเทพฯ"
  },
  adminProfile:{
    name:"ธนกฤต วัฒนชัย",adminId:"ADM-2026-001",position:"ผู้ดูแลระบบ",department:"ฝ่ายบริหารแพลตฟอร์ม",phone:"02-111-2233",email:"admin@dekintern.co.th",line:"@dekintern-admin",address:"สำนักงานใหญ่ DEK INTERN, กรุงเทพฯ"
  },
  currentSmartRankPostId:null,
  showPostJobForm:false
};

/* ========== Student skills data ========== */
const studentSkillsData=[
  {name:"JavaScript",verified:true},
  {name:"React",verified:true},
  {name:"Python",verified:false},
  {name:"Git",verified:true},
  {name:"SQL",verified:false},
  {name:"English Communication",verified:true},
  {name:"Teamwork & Agile",verified:false}
];
const skillGroups=[
  {id:"technical",title:"Technical Skill",desc:"ความสามารถด้านเครื่องมือและเทคโนโลยี",options:["JavaScript","React","Python","Git","SQL","UI/UX Design"]},
  {id:"soft",title:"Soft Skill",desc:"ทักษะการทำงานร่วมกับผู้อื่น",options:["การปรับตัว","ควบคุมอารมณ์ได้ดี","การทำงานเป็นทีม","การสื่อสาร","การบริหารเวลา"]},
  {id:"cognitive",title:"Cognitive Skill",desc:"ทักษะด้านการคิด วิเคราะห์ และเรียนรู้",options:["การคิดวิเคราะห์","การแก้ปัญหา","ความคิดสร้างสรรค์","การตัดสินใจ","การเรียนรู้เร็ว"]}
];
state.studentSelectedSkills=["JavaScript","React","Python","Git","SQL","การปรับตัว","การทำงานเป็นทีม","การสื่อสาร","การคิดวิเคราะห์","การแก้ปัญหา"];

/* ========== Menu ========== */
const menu={
  student:[["jobs","งานแนะนำ"],["jobboard","ประกาศงานทั้งหมด"],["applications","การสมัคร"],["favorites","รายการโปรด"],["profile","ข้อมูลส่วนตัว"]],
  enterprise:[["myPosts","ประกาศของฉัน"],["profile","ข้อมูลส่วนตัว"]],
  institution:[["verify","Dashboard"],["profile","ประวัติส่วนตัว"]],
  admin:[["dashboard","Dashboard"],["enterprise","คำขออนุมัติ"],["moderation","ตรวจสอบโพสต์"],["profile","ประวัติส่วนตัว"]]
};

