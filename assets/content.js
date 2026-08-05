/* =========================================================
   CJ KLINIK — shared content & clinic configuration
   Edit this file to update clinic info, services, doctors, etc.
   Loaded as a plain script on every page (defines window.CJ_CONTENT).
   ========================================================= */
(function(){

// Services shown as headline highlight cards — reflects CJ Klinik's public
// Facebook/Instagram pages. Edit freely if your actual service list differs.
const SERVICES = [
  {icon:'🤰', name:{en:"Women's Health",zh:'女性健康',ms:'Kesihatan Wanita'},
   desc:{en:'Pap smears, ultrasounds, pregnancy screening and more.',zh:'子宫颈抹片检查、超声波检查、验孕筛查等。',ms:'Ujian Pap smear, ultrasound, saringan kehamilan dan banyak lagi.'}},
  {icon:'🧔', name:{en:"Men's Health & Hair Loss",zh:'男性健康与脱发治疗',ms:'Kesihatan Lelaki & Rawatan Keguguran Rambut'},
   desc:{en:"Men's health consultations and hair loss treatments.",zh:'男性健康咨询与脱发治疗。',ms:'Konsultasi kesihatan lelaki dan rawatan keguguran rambut.'}},
  {icon:'🧬', name:{en:'STD Screening & Management',zh:'性病筛查与管理',ms:'Saringan & Pengurusan STD'},
   desc:{en:'Private and discreet STD screening and management.',zh:'私密且保密的性病筛查与治疗服务。',ms:'Saringan dan pengurusan STD secara peribadi dan sulit.'}},
  {icon:'⚖️', name:{en:'Medical Weight Management',zh:'医学减重管理',ms:'Pengurusan Berat Badan Perubatan'},
   desc:{en:'Medically supervised weight-management programs.',zh:'医生监督下的体重管理计划。',ms:'Program pengurusan berat badan di bawah pengawasan doktor.'}},
  {icon:'💉', name:{en:'Health Screenings & Vaccinations',zh:'健康检查与疫苗接种',ms:'Saringan Kesihatan & Vaksinasi'},
   desc:{en:'Health screenings and vaccinations, including Influenza and Gardasil 9.',zh:'健康检查与疫苗接种，包括流感疫苗及 Gardasil 9 疫苗。',ms:'Saringan kesihatan dan vaksinasi, termasuk Influenza dan Gardasil 9.'}}
];

const FACILITIES = [
  {icon:'🔬', name:{en:'Laboratory Testing Equipment',zh:'化验检测仪器',ms:'Peralatan Ujian Makmal'}},
  {icon:'💧', name:{en:'IV Drip Therapy Station',zh:'点滴治疗站',ms:'Stesen Terapi Titisan IV'}},
  {icon:'📊', name:{en:'Body Composition Analyzer',zh:'身体成分分析仪',ms:'Penganalisis Komposisi Badan'}},
  {icon:'❄️', name:{en:'Vaccine Cold-chain Storage',zh:'疫苗冷链存储',ms:'Storan Rantaian Sejuk Vaksin'}},
  {icon:'💆', name:{en:'Aesthetic Treatment Room',zh:'美容治疗室',ms:'Bilik Rawatan Estetik'}},
  {icon:'🩺', name:{en:'Consultation Rooms',zh:'诊疗室',ms:'Bilik Konsultasi'}}
];
// ^ Sample placeholders — replace with your clinic's actual equipment list.

const DOCTORS = [
  // Gender not confirmed from public sources — using a neutral icon for now.
  {id:'d1', gender:'unspecified', name:'Dr. Lam Joey', photo:'🩺',
   specialties:{en:['Family Medicine','General Consultations'], zh:['家庭医学','全科诊疗'], ms:['Perubatan Keluarga','Konsultasi Am']},
   role:{en:'General Practitioner', zh:'全科医生', ms:'Pengamal Perubatan Am'},
   bio:{en:'Dr. Lam Joey is a General Practitioner at CJ Klinik, focusing on family medicine and general health consultations.',
        zh:'Dr. Lam Joey 是 CJ Klinik 的全科医生，专注于家庭医学与一般健康咨询。',
        ms:'Dr. Lam Joey ialah Pengamal Perubatan Am di CJ Klinik yang menumpukan kepada perubatan keluarga dan konsultasi kesihatan am.'}},
  {id:'d2', gender:'unspecified', name:'Dr. Chawin', photo:'🩺',
   specialties:{en:["Men's Health",'Chronic Disease Management'], zh:['男性健康','慢性病管理'], ms:['Kesihatan Lelaki','Pengurusan Penyakit Kronik']},
   role:{en:'General Practitioner', zh:'全科医生', ms:'Pengamal Perubatan Am'},
   bio:{en:"Dr. Chawin is a General Practitioner with a special interest in men's health and chronic disease management.",
        zh:'Dr. Chawin 是全科医生，特别专注于男性健康与慢性病管理。',
        ms:'Dr. Chawin ialah Pengamal Perubatan Am dengan minat khusus dalam kesihatan lelaki dan pengurusan penyakit kronik.'}}
];
// ^ Names/roles/specialties sourced from CJ Klinik's public pages & a clinic
// directory listing. Please verify and correct before publishing.

const GUIDELINE_CHECKLIST = [
  {en:'Complete clinic orientation & meet the team', zh:'完成诊所入职介绍并认识团队', ms:'Lengkapkan orientasi klinik dan berkenalan dengan pasukan'},
  {en:'Learn how to use the front-desk / booking system', zh:'学习使用前台/预约系统', ms:'Pelajari cara menggunakan sistem kaunter / tempahan'},
  {en:'Review Standard Operating Procedures (SOP) for patient intake', zh:'熟悉病人接待的标准作业程序（SOP）', ms:'Semak Prosedur Operasi Standard (SOP) untuk penerimaan pesakit'},
  {en:'Learn how to access & update the Google Sheets (TPA, lab test, preorder, weight-loss, TPA price)', zh:'学习查阅与更新 Google 表格（TPA、化验、预购、减肥、TPA价格）', ms:'Pelajari cara mengakses & mengemas kini Google Sheets (TPA, ujian makmal, pratempahan, penurunan berat badan, harga TPA)'},
  {en:'Understand how to post daily notices (rest day / closure) on the website', zh:'了解如何在网站发布每日通知（休息／不营业）', ms:'Fahami cara menyiarkan notis harian (hari rehat / penutupan) di laman web'},
  {en:'Know the emergency contact & escalation procedure', zh:'了解紧急联络与上报程序', ms:'Ketahui prosedur hubungan kecemasan & eskalasi'}
];

const SHEET_CONFIG = [
  {key:'tpa', icon:'🏥', label:{en:'TPA (Insurance)',zh:'TPA 医保',ms:'TPA (Insurans)'}, desc:{en:'Third-party insurer claims sheet',zh:'第三方医保理赔表格',ms:'Helaian tuntutan insurans pihak ketiga'}},
  {key:'labtest', icon:'🧪', label:{en:'Lab Test',zh:'化验 Lab Test',ms:'Ujian Makmal'}, desc:{en:'Lab test records & results',zh:'化验记录与结果',ms:'Rekod & keputusan ujian makmal'}},
  {key:'preorder', icon:'💊', label:{en:'Medicine Preorder',zh:'药品预购 Preorder',ms:'Pra-tempahan Ubat'}, desc:{en:'Customer medicine preorder tracking',zh:'顾客药品预购追踪',ms:'Penjejakan pratempahan ubat pelanggan'}},
  {key:'weightloss', icon:'⚖️', label:{en:'Weight-loss Form',zh:'减肥表格',ms:'Borang Penurunan Berat Badan'}, desc:{en:'Weight-loss program tracking form',zh:'减肥计划追踪表格',ms:'Borang penjejakan program penurunan berat badan'}},
  {key:'tpaprice', icon:'💰', label:{en:'TPA Price List',zh:'TPA 价格',ms:'Senarai Harga TPA'}, desc:{en:'Pricing reference for TPA claims',zh:'TPA理赔价格参考',ms:'Rujukan harga untuk tuntutan TPA'}}
];

const NOTICE_TEMPLATES = [
  {type:'rest', icon:'😴', label:{en:'Resting Today',zh:'今日休息',ms:'Rehat Hari Ini'},
   message:{en:'We are taking a short rest today. Sorry for the inconvenience — we will resume normal hours tomorrow.',
             zh:'我们今日暂停营业休息，为您带来的不便敬请谅解，明日将恢复正常营业时间。',
             ms:'Kami mengambil rehat sebentar hari ini. Mohon maaf atas kesulitan — kami akan beroperasi seperti biasa esok.'}},
  {type:'closed', icon:'🚫', label:{en:'Not Open Today',zh:'今日不营业',ms:'Tidak Beroperasi Hari Ini'},
   message:{en:'The clinic is closed today. Please check back for updates, or contact us for urgent matters.',
             zh:'诊所今日不营业。请留意页面更新，紧急事项请联系我们。',
             ms:'Klinik ditutup hari ini. Sila semak semula untuk kemas kini, atau hubungi kami untuk perkara kecemasan.'}}
];

const SERVICE_OPTIONS = SERVICES.map(s=>s.name);

// Full itemised service list, sourced from CJ Klinik's own social media
// service-list graphic. Malay wording is a best-effort translation.
const SERVICE_LIST_FULL = [
  {en:'General Medicine', zh:'综合内科', ms:'Perubatan Am'},
  {en:'Family Planning', zh:'家庭计划服务', ms:'Perancangan Keluarga'},
  {en:'ECG (Electrocardiogram)', zh:'心电图检查', ms:'ECG (Elektrokardiogram)'},
  {en:'Asthma / Nebuliser', zh:'雾化治疗', ms:'Asma / Nebulizer'},
  {en:'Suctioning', zh:'吸痰治疗', ms:'Penyedutan (Suction)'},
  {en:'Vaccination (Influenza, Typhoid, Hepatitis B, Pneumococcal, Dengue & others)', zh:'疫苗接种（流感、伤寒、乙型肝炎、肺炎球菌、登革热等）', ms:'Vaksinasi (Influenza, Tifoid, Hepatitis B, Pneumokokal, Denggi & lain-lain)'},
  {en:'Full Medical Checkup', zh:'全面体检', ms:'Pemeriksaan Perubatan Penuh'},
  {en:'Vocational Driving License Medical Checkup (GDL)', zh:'驾驶执照体检', ms:'Pemeriksaan Perubatan Lesen Memandu Vokasional (GDL)'},
  {en:'Urine Analyser', zh:'尿液分析', ms:'Penganalisis Air Kencing'},
  {en:'Full Blood Count', zh:'全血细胞计数', ms:'Kiraan Darah Penuh'},
  {en:'Foreign Worker Examination', zh:'外籍劳工体检', ms:'Pemeriksaan Pekerja Asing'},
  {en:'Emergency Services', zh:'紧急医疗服务', ms:'Perkhidmatan Kecemasan'},
  {en:"Men's Health", zh:'男性健康', ms:'Kesihatan Lelaki'},
  {en:"Women's Health (Pap Smear, Contraception)", zh:'女性健康管理（子宫颈抹片、避孕咨询）', ms:'Kesihatan Wanita (Pap Smear, Kontrasepsi)'},
  {en:'Minor Surgical Procedures', zh:'小型手术', ms:'Prosedur Pembedahan Kecil'},
  {en:'Chronic Disease Management', zh:'慢性疾病治疗', ms:'Pengurusan Penyakit Kronik'},
  {en:'Medical Health Screening (Blood/Urine, Allergy, Cancer)', zh:'全面健康检查（血液尿液、过敏原、癌症检查）', ms:'Saringan Kesihatan Perubatan (Darah/Air Kencing, Alahan, Kanser)'},
  {en:'Pre-Marital Screening', zh:'婚前检查', ms:'Saringan Pra-Perkahwinan'},
  {en:'Advanced Wound Care Management / Dressing', zh:'专业伤口护理', ms:'Pengurusan Rawatan Luka Lanjutan'},
  {en:'Diabetic Foot Management', zh:'糖尿病足部护理', ms:'Pengurusan Kaki Diabetes'},
  {en:'Skin Disease / Dermatology', zh:'皮肤病治疗', ms:'Penyakit Kulit / Dermatologi'},
  {en:'Sexually Transmitted Disease', zh:'性传染病', ms:'Penyakit Kelamin'},
  {en:'Pre-Employment / University Medical Screening', zh:'入职/大学预科健康检测', ms:'Saringan Perubatan Pra-Pekerjaan / Universiti'},
  {en:'Intravenous Drip', zh:'吊水服务', ms:'Titisan Intravena'},
  {en:'Dengue Rapid Test', zh:'登革热快速检测', ms:'Ujian Pantas Denggi'},
  {en:'COVID-19 / Influenza Swab', zh:'冠状病毒/流感检测', ms:'Ujian Swab COVID-19 / Influenza'},
  {en:'Panel Service', zh:'指定诊所服务', ms:'Perkhidmatan Panel'}
];

const HEALTH_TIPS = [
  {icon:'🤰', title:{en:'Rubella Screening for Pregnancy',zh:'孕前风疹抗体检查',ms:'Saringan Rubella untuk Kehamilan'},
   text:{en:"Planning a pregnancy or pregnant now? Don't forget the Rubella (IgG) blood test — infection in early pregnancy may affect your baby's development. A simple blood test checks if you're protected.",
         zh:'计划怀孕或已经怀孕？别忘了做风疹抗体检查（Rubella IgG）。怀孕初期若感染风疹，可能影响宝宝发育。简单验血即可知道您是否已有保护抗体。',
         ms:'Merancang kehamilan atau sedang hamil? Jangan lupa ujian darah Rubella (IgG) — jangkitan pada awal kehamilan boleh menjejaskan perkembangan bayi. Ujian darah mudah dapat menyemak sama ada anda dilindungi.'}},
  {icon:'🧠', title:{en:'Tension Headache Relief Therapy',zh:'压力性头痛舒缓疗程',ms:'Terapi Kelegaan Sakit Kepala Tegang'},
   text:{en:'Long hours on screen, stress and poor posture can cause tension headaches. Our wellness pain relief therapy helps relax tight muscles and reduce tension.',
         zh:'长时间用电脑、压力大、姿势不良都可能导致压力性头痛。我们的舒缓理疗有助放松紧绷肌肉，减轻头痛。',
         ms:'Waktu skrin yang lama, tekanan dan postur yang tidak baik boleh menyebabkan sakit kepala tegang. Terapi kelegaan kami membantu melegakan otot tegang.'}},
  {icon:'🤵', title:{en:'Male Fertility Screening',zh:'男性生育能力检查',ms:'Saringan Kesuburan Lelaki'},
   text:{en:'Trying for a baby? Our semen analysis checks sperm count, motility and morphology — private, confidential and professional.',
         zh:'准备生育？我们提供精液分析检查（精子数量、活动力、形态），私密且专业。',
         ms:'Cuba untuk mendapatkan anak? Analisis air mani kami menyemak kiraan, pergerakan dan bentuk sperma — sulit dan profesional.'}},
  {icon:'💉', title:{en:'HPV Vaccine (Gardasil 9)',zh:'HPV 疫苗（Gardasil 9）',ms:'Vaksin HPV (Gardasil 9)'},
   text:{en:'Gardasil 9 helps protect ages 9–45 against diseases caused by 9 HPV types, including cervical cancer and genital warts, for both males and females.',
         zh:'Gardasil 9 可帮助9至45岁人士预防9种HPV病毒引发的疾病，包括子宫颈癌及生殖器疣，男女皆适用。',
         ms:'Gardasil 9 membantu melindungi usia 9–45 tahun daripada penyakit disebabkan 9 jenis HPV, termasuk kanser serviks dan kutil kelamin, untuk lelaki dan wanita.'}}
];

const PANEL_ADMINISTRATORS = ['PERKESO','EMAS','PMCare','MiCARE','Compumed','SEHATI','Mednefits','WeCare','RedAlert Online'];
const CORPORATE_CLIENTS = ['Starbucks','City-Link Express','Bank Negara Malaysia','TM','POS Malaysia','KWSP EPF','LHDN Malaysia','Tabung Haji','Bank Islam','Affin Bank','Bank Rakyat','Malaysia Airlines','IJM','Intel','Dell','Bosch','Jabil','Micron','AMD','Hong Leong Bank','Amway','SanDisk','SAM'];

const DAY_LABELS = {
  mon:{en:'Monday',zh:'星期一',ms:'Isnin'},
  tue:{en:'Tuesday',zh:'星期二',ms:'Selasa'},
  wed:{en:'Wednesday',zh:'星期三',ms:'Rabu'},
  thu:{en:'Thursday',zh:'星期四',ms:'Khamis'},
  fri:{en:'Friday',zh:'星期五',ms:'Jumaat'},
  sat:{en:'Saturday',zh:'星期六',ms:'Sabtu'},
  sun:{en:'Sunday',zh:'星期日',ms:'Ahad'}
};

const CLINIC_NAME = 'CJ Klinik';
const CLINIC_LOCATION = {en:'Jelutong, Penang', zh:'槟城日落洞', ms:'Jelutong, Pulau Pinang'};
const CLINIC_ADDRESS_FULL = {
  en:'No 16-1 (Ground Floor), Lebuh Sungai Pinang 1, 11600 Jelutong, Penang (Opposite 3 Residence Condominium)',
  zh:'No 16-1 (Ground Floor), Lebuh Sungai Pinang 1, 11600 Jelutong, Penang（3 Residence 公寓对面）',
  ms:'No 16-1 (Tingkat Bawah), Lebuh Sungai Pinang 1, 11600 Jelutong, Pulau Pinang (Bertentangan Kondominium 3 Residence)'
};
const CLINIC_MAPS_QUERY = 'Klinik CJ, No 16-1, Lebuh Sungai Pinang 1, 11600 Jelutong, Penang, Malaysia';
function googleMapsUrl(){ return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CLINIC_MAPS_QUERY); }

const CLINIC_PHONE_DISPLAY = '+60 4-282 0811';
const CLINIC_PHONE_TEL = 'tel:+6042820811';
const CLINIC_WHATSAPP_DISPLAY = '+6017-676 5400';
const CLINIC_WHATSAPP_LINK = 'https://wa.me/60176765400';
const CLINIC_EMAIL = 'klinikcj@gmail.com'; // found via a public clinic directory listing — confirm before publishing
const OPENING_HOURS = [
  {day:{en:'Monday – Friday',zh:'星期一至星期五',ms:'Isnin – Jumaat'}, hours:'8:00 AM – 6:00 PM'},
  {day:{en:'Saturday',zh:'星期六',ms:'Sabtu'}, hours:{en:'Closed',zh:'休息',ms:'Tutup'}},
  {day:{en:'Sunday',zh:'星期日',ms:'Ahad'}, hours:'8:00 AM – 1:00 PM'}
];

const UI = {
en:{
  brand:CLINIC_NAME, brandTag:'Your trusted family clinic',
  nav_home:'Home', nav_doctors:'Our Doctors', nav_duty:"Today's Duty Doctor", nav_booking:'Book Appointment', nav_staffLogin:'Staff Login',
  staff_dashboard:'Dashboard', staff_guidelines:'Guidelines', staff_sheets:'Google Sheets', staff_timetable:'Duty Timetable', staff_slots:'Doctor Slots', staff_notices:'Notices', staff_appointments:'Appointments', staff_logout:'Log Out',
  login_title:'Staff Login', login_desc:'For staff use only — internal system.', login_pass:'Passcode', login_submit:'Log in', login_error:'Incorrect passcode.', login_note:'Contact your clinic administrator if you’ve forgotten the shared staff passcode.',
  home_heroTitle:'Caring for you and your family', home_heroSub:'CJ Klinik offers trusted medical, therapy and aesthetic services with modern facilities and experienced doctors.', home_heroCta:'Book an Appointment',
  home_servicesTitle:'Our Services', home_facilitiesTitle:'Our Facilities & Equipment',
  doctors_title:'Our Doctors', doctors_subtitle:'Meet the doctors who will take care of you.', doctors_specialties:'Specialties', doctors_university:'University', doctors_bookBtn:'Book with this doctor',
  duty_title:"Today's Duty Doctor", duty_subtitle:'See which doctor is on duty for each slot today.', duty_morning:'Morning Slot', duty_afternoon:'Afternoon Slot', duty_tbc:'To be confirmed',
  booking_title:'Book an Appointment', booking_subtitle:'Fill in your details and we will confirm your slot shortly.',
  booking_name:'Full Name', booking_phone:'Phone Number', booking_date:'Preferred Date', booking_slot:'Preferred Slot', booking_service:'Service', booking_doctorPref:'Doctor Preference', booking_noPref:'No preference', booking_notes:'Notes (optional)', booking_submit:'Submit Booking',
  booking_success:'Thank you! Your booking has been received. Our staff will confirm shortly.', booking_error:'Something went wrong submitting your booking. Please try again or contact us directly.',
  booking_infoTitle:"What happens next?", booking_info1:'Your request appears instantly in our staff system.', booking_info2:'Our staff will contact you to confirm the exact time.', booking_info3:'You will receive a reminder before your visit.',
  slot_morning:'Morning', slot_afternoon:'Afternoon', slot_both:'Both',
  footer_rights:'All rights reserved.', footer_lang:'Language', view_on_map:'View on Google Maps',
  visit_title:'Visit Us', visit_address:'Address', visit_phone:'Phone', visit_whatsapp:'WhatsApp', visit_email:'Email', visit_hours:'Opening Hours', visit_walkins:'Walk-ins welcome',
  fullServices_title:'Complete List of Services', healthTips_title:'Health Tips From Our Clinic', trusted_title:'Trusted By', trusted_panel:'Official Panel Clinic For', trusted_corporate:'Our Corporate Clients Include', trusted_andMore:'…and many more',
  dash_welcome:'Welcome back', dash_newAppts:'New Appointments', dash_todayNotice:"Today's Notice", dash_noNotice:'Normal operating hours', dash_quickLinks:'Quick Links',
  guidelines_title:'New Staff Guidelines', guidelines_sub:'Steps every new staff member should complete.', guidelines_docTitle:'Full Guidelines Document', guidelines_docMissing:'No guideline document linked yet.', guidelines_docNote:'Paste your Google Doc share link below — once added, staff will be able to open the full guidelines from here.', guidelines_docPlaceholder:'Paste Google Doc link…', guidelines_saveBtn:'Save Link', guidelines_openBtn:'Open Guidelines Document ↗', guidelines_linked:'Guideline document linked.',
  sheets_title:'Google Sheets', sheets_sub:'Quick access to shared clinic spreadsheets.', sheets_placeholder:'Paste Google Sheet link…', sheets_saveBtn:'Save', sheets_openBtn:'Open Sheet ↗', sheets_notSet:'Link not set yet',
  timetable_title:'Staff Duty Timetable', timetable_sub:'Weekly working schedule — click any cell to edit.',
  slots_title:'Doctor Slot Assignment', slots_sub:"Choose each doctor's working slot(s) for the selected date.", slots_date:'Date', slots_current:'Current:',
  notices_title:'Post a Notice', notices_sub:'Let customers know if the clinic is resting or closed today.', notices_templates:'Choose a template', notices_message:'Message', notices_publish:'Publish to Website', notices_clear:'Clear Notice', notices_activeNow:'Currently showing on customer site:', notices_none:'No notice is currently active — customers see normal operating hours.',
  notices_socialTitle:'Auto-post to Instagram & Facebook', notices_socialDesc:'This feature is wired and ready. Connect your Meta Business account to let publishing a notice here also post it automatically to Instagram and Facebook.', notices_socialLocked:'Not connected yet',
  appts_title:'Appointment Requests', appts_sub:'Bookings submitted from the customer website.', appts_empty:'No appointments yet.', col_name:'Name', col_contact:'Contact', col_date:'Date', col_slot:'Slot', col_service:'Service', col_doctor:'Doctor Pref.', col_status:'Status', appts_confirm:'Confirm', status_new:'New', status_confirmed:'Confirmed',
  viewPublic:'View Public Site', loading:'Loading…'
},
zh:{
  brand:CLINIC_NAME, brandTag:'您信赖的家庭诊所',
  nav_home:'首页', nav_doctors:'医生介绍', nav_duty:'今日站岗医生', nav_booking:'预约挂号', nav_staffLogin:'员工登录',
  staff_dashboard:'工作台', staff_guidelines:'新人指南', staff_sheets:'Google 表格', staff_timetable:'排班表', staff_slots:'医生排班', staff_notices:'通知发布', staff_appointments:'预约列表', staff_logout:'登出',
  login_title:'员工登录', login_desc:'仅供内部员工使用。', login_pass:'密码', login_submit:'登录', login_error:'密码错误。', login_note:'如忘记共用员工密码，请联系诊所管理员。',
  home_heroTitle:'用心呵护您与家人的健康', home_heroSub:'CJ Klinik 提供值得信赖的医疗、理疗与美容服务，配备现代化设备与经验丰富的医生。', home_heroCta:'立即预约',
  home_servicesTitle:'我们的服务', home_facilitiesTitle:'设备与仪器',
  doctors_title:'医生介绍', doctors_subtitle:'认识将为您服务的医生团队。', doctors_specialties:'擅长领域', doctors_university:'毕业院校', doctors_bookBtn:'预约此医生',
  duty_title:'今日站岗医生', duty_subtitle:'查看今日各时段的当值医生。', duty_morning:'上午时段', duty_afternoon:'下午时段', duty_tbc:'待确认',
  booking_title:'预约挂号', booking_subtitle:'填写您的资料，我们将尽快确认预约时间。',
  booking_name:'姓名', booking_phone:'联络电话', booking_date:'预约日期', booking_slot:'时段选择', booking_service:'服务项目', booking_doctorPref:'指定医生', booking_noPref:'不指定', booking_notes:'备注（选填）', booking_submit:'提交预约',
  booking_success:'谢谢！您的预约已收到，我们的员工将尽快与您确认。', booking_error:'提交预约时发生错误，请重试或直接联系我们。',
  booking_infoTitle:'接下来会怎样？', booking_info1:'您的预约会立即出现在我们的员工系统中。', booking_info2:'我们的员工会联系您确认具体时间。', booking_info3:'就诊前您将收到提醒通知。',
  slot_morning:'上午', slot_afternoon:'下午', slot_both:'全天',
  footer_rights:'版权所有。', footer_lang:'语言', view_on_map:'在 Google 地图查看',
  visit_title:'门店信息', visit_address:'地址', visit_phone:'电话', visit_whatsapp:'WhatsApp', visit_email:'电邮', visit_hours:'营业时间', visit_walkins:'欢迎随时到诊（无需预约）',
  fullServices_title:'完整医疗服务列表', healthTips_title:'诊所健康小贴士', trusted_title:'合作伙伴', trusted_panel:'指定诊所服务对象', trusted_corporate:'部分企业客户', trusted_andMore:'……及更多',
  dash_welcome:'欢迎回来', dash_newAppts:'新预约', dash_todayNotice:'今日通知', dash_noNotice:'正常营业中', dash_quickLinks:'快速链接',
  guidelines_title:'新员工指南', guidelines_sub:'每位新员工都应完成以下步骤。', guidelines_docTitle:'完整指南文件', guidelines_docMissing:'尚未链接指南文件。', guidelines_docNote:'请在下方粘贴 Google 文档分享链接，添加后员工即可在此打开完整指南。', guidelines_docPlaceholder:'粘贴 Google 文档链接…', guidelines_saveBtn:'保存链接', guidelines_openBtn:'打开指南文件 ↗', guidelines_linked:'指南文件已链接。',
  sheets_title:'Google 表格', sheets_sub:'快速访问共享的诊所表格。', sheets_placeholder:'粘贴 Google 表格链接…', sheets_saveBtn:'保存', sheets_openBtn:'打开表格 ↗', sheets_notSet:'尚未设置链接',
  timetable_title:'员工排班表', timetable_sub:'每周工作排班 — 点击格子即可编辑。',
  slots_title:'医生排班设置', slots_sub:'为所选日期设置每位医生的当值时段。', slots_date:'日期', slots_current:'当前：',
  notices_title:'发布通知', notices_sub:'让顾客知道诊所今日休息或不营业。', notices_templates:'选择模板', notices_message:'通知内容', notices_publish:'发布到网站', notices_clear:'清除通知', notices_activeNow:'目前显示在顾客网站上：', notices_none:'目前没有生效中的通知 — 顾客将看到正常营业时间。',
  notices_socialTitle:'自动发布到 Instagram 和 Facebook', notices_socialDesc:'此功能已开发完成，随时可用。连接您的 Meta 商业账号后，在此发布通知也会自动同步到 Instagram 和 Facebook。', notices_socialLocked:'尚未连接',
  appts_title:'预约请求', appts_sub:'来自顾客网站提交的预约。', appts_empty:'暂无预约。', col_name:'姓名', col_contact:'联络方式', col_date:'日期', col_slot:'时段', col_service:'服务', col_doctor:'指定医生', col_status:'状态', appts_confirm:'确认', status_new:'新', status_confirmed:'已确认',
  viewPublic:'查看顾客网站', loading:'加载中…'
},
ms:{
  brand:CLINIC_NAME, brandTag:'Klinik keluarga yang anda percayai',
  nav_home:'Laman Utama', nav_doctors:'Doktor Kami', nav_duty:'Doktor Bertugas Hari Ini', nav_booking:'Tempah Temujanji', nav_staffLogin:'Log Masuk Staf',
  staff_dashboard:'Papan Pemuka', staff_guidelines:'Panduan', staff_sheets:'Google Sheets', staff_timetable:'Jadual Waktu Staf', staff_slots:'Slot Doktor', staff_notices:'Notis', staff_appointments:'Temujanji', staff_logout:'Log Keluar',
  login_title:'Log Masuk Staf', login_desc:'Untuk kegunaan staf sahaja — sistem dalaman.', login_pass:'Kata Laluan', login_submit:'Log Masuk', login_error:'Kata laluan salah.', login_note:'Hubungi pentadbir klinik anda jika terlupa kata laluan staf yang dikongsi.',
  home_heroTitle:'Menjaga anda dan keluarga anda', home_heroSub:'CJ Klinik menawarkan perkhidmatan perubatan, terapi dan estetik yang dipercayai dengan kemudahan moden dan doktor berpengalaman.', home_heroCta:'Tempah Temujanji',
  home_servicesTitle:'Perkhidmatan Kami', home_facilitiesTitle:'Kemudahan & Peralatan Kami',
  doctors_title:'Doktor Kami', doctors_subtitle:'Kenali doktor yang akan menjaga anda.', doctors_specialties:'Kepakaran', doctors_university:'Universiti', doctors_bookBtn:'Tempah dengan doktor ini',
  duty_title:'Doktor Bertugas Hari Ini', duty_subtitle:'Lihat doktor yang bertugas untuk setiap slot hari ini.', duty_morning:'Slot Pagi', duty_afternoon:'Slot Petang', duty_tbc:'Akan disahkan',
  booking_title:'Tempah Temujanji', booking_subtitle:'Isi maklumat anda dan kami akan sahkan slot anda tidak lama lagi.',
  booking_name:'Nama Penuh', booking_phone:'Nombor Telefon', booking_date:'Tarikh Pilihan', booking_slot:'Slot Pilihan', booking_service:'Perkhidmatan', booking_doctorPref:'Pilihan Doktor', booking_noPref:'Tiada keutamaan', booking_notes:'Nota (pilihan)', booking_submit:'Hantar Tempahan',
  booking_success:'Terima kasih! Tempahan anda telah diterima. Staf kami akan sahkan tidak lama lagi.', booking_error:'Ralat berlaku semasa menghantar tempahan. Sila cuba lagi atau hubungi kami terus.',
  booking_infoTitle:'Apa seterusnya?', booking_info1:'Permintaan anda akan muncul serta-merta dalam sistem staf kami.', booking_info2:'Staf kami akan menghubungi anda untuk mengesahkan masa tepat.', booking_info3:'Anda akan menerima peringatan sebelum lawatan anda.',
  slot_morning:'Pagi', slot_afternoon:'Petang', slot_both:'Kedua-dua',
  footer_rights:'Hak cipta terpelihara.', footer_lang:'Bahasa', view_on_map:'Lihat di Google Maps',
  visit_title:'Lawati Kami', visit_address:'Alamat', visit_phone:'Telefon', visit_whatsapp:'WhatsApp', visit_email:'E-mel', visit_hours:'Waktu Operasi', visit_walkins:'Pesakit tanpa temujanji dialu-alukan',
  fullServices_title:'Senarai Lengkap Perkhidmatan', healthTips_title:'Tip Kesihatan Dari Klinik Kami', trusted_title:'Dipercayai Oleh', trusted_panel:'Klinik Panel Rasmi Untuk', trusted_corporate:'Antara Pelanggan Korporat Kami', trusted_andMore:'…dan banyak lagi',
  dash_welcome:'Selamat kembali', dash_newAppts:'Temujanji Baharu', dash_todayNotice:'Notis Hari Ini', dash_noNotice:'Waktu operasi biasa', dash_quickLinks:'Pautan Pantas',
  guidelines_title:'Panduan Staf Baharu', guidelines_sub:'Langkah yang perlu dilengkapkan oleh setiap staf baharu.', guidelines_docTitle:'Dokumen Panduan Penuh', guidelines_docMissing:'Belum ada dokumen panduan dipautkan.', guidelines_docNote:'Tampal pautan kongsi Google Doc anda di bawah — selepas ditambah, staf boleh membuka panduan penuh dari sini.', guidelines_docPlaceholder:'Tampal pautan Google Doc…', guidelines_saveBtn:'Simpan Pautan', guidelines_openBtn:'Buka Dokumen Panduan ↗', guidelines_linked:'Dokumen panduan telah dipautkan.',
  sheets_title:'Google Sheets', sheets_sub:'Akses pantas ke helaian klinik yang dikongsi.', sheets_placeholder:'Tampal pautan Google Sheet…', sheets_saveBtn:'Simpan', sheets_openBtn:'Buka Helaian ↗', sheets_notSet:'Pautan belum ditetapkan',
  timetable_title:'Jadual Waktu Staf', timetable_sub:'Jadual kerja mingguan — klik sel untuk sunting.',
  slots_title:'Penetapan Slot Doktor', slots_sub:'Pilih slot bekerja setiap doktor untuk tarikh dipilih.', slots_date:'Tarikh', slots_current:'Semasa:',
  notices_title:'Siarkan Notis', notices_sub:'Maklumkan pelanggan jika klinik rehat atau tutup hari ini.', notices_templates:'Pilih templat', notices_message:'Mesej', notices_publish:'Siarkan ke Laman Web', notices_clear:'Kosongkan Notis', notices_activeNow:'Sedang dipaparkan di laman pelanggan:', notices_none:'Tiada notis aktif buat masa ini — pelanggan akan melihat waktu operasi biasa.',
  notices_socialTitle:'Auto-siar ke Instagram & Facebook', notices_socialDesc:'Ciri ini telah siap dibina. Sambungkan akaun Meta Business anda supaya penyiaran notis di sini turut disiarkan secara automatik ke Instagram dan Facebook.', notices_socialLocked:'Belum disambungkan',
  appts_title:'Permintaan Temujanji', appts_sub:'Tempahan yang dihantar dari laman web pelanggan.', appts_empty:'Belum ada temujanji.', col_name:'Nama', col_contact:'Hubungan', col_date:'Tarikh', col_slot:'Slot', col_service:'Perkhidmatan', col_doctor:'Pilihan Doktor', col_status:'Status', appts_confirm:'Sahkan', status_new:'Baharu', status_confirmed:'Disahkan',
  viewPublic:'Lihat Laman Awam', loading:'Memuatkan…'
}
};

window.CJ_CONTENT = {
  SERVICES, FACILITIES, DOCTORS, GUIDELINE_CHECKLIST, SHEET_CONFIG, NOTICE_TEMPLATES, DAY_LABELS,
  SERVICE_OPTIONS, SERVICE_LIST_FULL, HEALTH_TIPS, PANEL_ADMINISTRATORS, CORPORATE_CLIENTS,
  CLINIC_NAME, CLINIC_LOCATION, CLINIC_ADDRESS_FULL, CLINIC_MAPS_QUERY, googleMapsUrl,
  CLINIC_PHONE_DISPLAY, CLINIC_PHONE_TEL, CLINIC_WHATSAPP_DISPLAY, CLINIC_WHATSAPP_LINK,
  CLINIC_EMAIL, OPENING_HOURS, UI
};
})();
