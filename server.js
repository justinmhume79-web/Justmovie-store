require("dotenv").config();
const express=require("express"), mongoose=require("mongoose"), bcrypt=require("bcryptjs"), cors=require("cors");
const path=require("path");
const app=express(); app.use(cors()); app.use(express.json()); app.use(express.static(path.join(__dirname,"public")));

const User=mongoose.model("User",new mongoose.Schema({
 email:{type:String,required:true,unique:true},number:String,username:{type:String,required:true,unique:true},passwordHash:String
},{timestamps:true}));
const Video=mongoose.model("Video",new mongoose.Schema({
 title:String,category:{type:String,enum:["movie","comedy","music","other"],default:"movie"},
 description:String,url:String,passwordHash:String,createdBy:String
},{timestamps:true}));

app.post("/api/auth/register",async(req,res)=>{
 try{const {email,number,username,password}=req.body;
 if(!email||!username||!password)return res.status(400).json({message:"Email, username and password are required"});
 const passwordHash=await bcrypt.hash(password,12); await User.create({email,number,username,passwordHash});
 res.json({message:"Account created successfully"});
 }catch(e){res.status(400).json({message:"Account could not be created. Username or email may already exist."})}
});
app.post("/api/auth/login",async(req,res)=>{
 const u=await User.findOne({username:req.body.username}); if(!u||!(await bcrypt.compare(req.body.password,u.passwordHash)))return res.status(401).json({message:"Invalid login"});
 res.json({message:"Login successful",username:u.username});
});
app.get("/api/videos",async(req,res)=>res.json(await Video.find().select("-passwordHash").sort({createdAt:-1})));
app.post("/api/videos/:id/unlock",async(req,res)=>{
 const v=await Video.findById(req.params.id); if(!v)return res.status(404).json({message:"Not found"});
 if(!await bcrypt.compare(req.body.password||"",v.passwordHash))return res.status(401).json({message:"Wrong password"});
 res.json({url:v.url});
});

/* Admin API: protect these routes with real admin authentication before production use. */
app.post("/api/admin/videos",async(req,res)=>{
 try{const {title,category,description,url,password}=req.body;if(!title||!url||!password)return res.status(400).json({message:"Missing fields"});
 const passwordHash=await bcrypt.hash(password,12);const v=await Video.create({title,category,description,url,passwordHash});
 res.json({id:v._id,message:"Video added"});
 }catch(e){res.status(400).json({message:"Could not add video"})}
});
app.delete("/api/admin/videos/:id",async(req,res)=>{await Video.findByIdAndDelete(req.params.id);res.json({message:"Deleted"})});

mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(process.env.PORT||3000,()=>console.log("JUSTINMOVIE STORE running"))).catch(e=>{console.error(e);process.exit(1)});
