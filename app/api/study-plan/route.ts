import { NextResponse } from "next/server";

type Task={id:string;subject:string;topic:string;minutes:number;priority:"high"|"medium"|"low";done:boolean};

function localAdapt(tasks:Task[],energy:number,available:number,examDays:number){
 const capacity=Math.max(15,Math.round(available*(0.55+energy*0.045)));
 const rank=(t:Task)=>(t.priority==="high"?3:t.priority==="medium"?2:1)+(examDays<=7&&t.priority==="high"?1:0);
 let left=capacity;
 const next=[...tasks].sort((a,b)=>rank(b)-rank(a)).map(t=>{if(t.done||left<=0)return t;const block=Math.min(t.minutes,left,energy<=3?20:45);left-=block;return {...t,minutes:Math.max(5,block)}})
 return {tasks:next,explanation:"I fitted the plan to about "+capacity+" realistic minutes using energy "+energy+"/10, "+available+" available minutes and an exam in "+examDays+" days."};
}

export async function POST(req:Request){
 try{
  const body=await req.json();const tasks=Array.isArray(body.tasks)?body.tasks:[];const energy=Math.min(10,Math.max(1,Number(body.energy)||5));const available=Math.min(240,Math.max(15,Number(body.available)||60));const examDays=Math.min(60,Math.max(1,Number(body.examDays)||14));
  if(!process.env.HF_TOKEN||!tasks.length)return NextResponse.json(localAdapt(tasks,energy,available,examDays));
  const response=await fetch("https://router.huggingface.co/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+process.env.HF_TOKEN,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.HF_MODEL||"openai/gpt-oss-20b",messages:[{role:"system",content:"You are an adaptive study planner. Return only JSON with tasks and explanation. Preserve completed tasks, never invent tasks, keep minutes 5-90, prioritize high priority work, and reduce workload when energy is low."},{role:"user",content:JSON.stringify({tasks,energy,available,examDays})}],temperature:.2,max_tokens:900})});
  if(!response.ok)return NextResponse.json(localAdapt(tasks,energy,available,examDays));
  const data=await response.json();const raw=data?.choices?.[0]?.message?.content?.trim()||"";const parsed=JSON.parse(raw.replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,""));if(!Array.isArray(parsed.tasks))throw new Error("invalid");return NextResponse.json(parsed);
 }catch{return NextResponse.json(localAdapt([],5,60,14))}
}