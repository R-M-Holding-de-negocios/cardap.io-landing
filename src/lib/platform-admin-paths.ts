export function platformAdminPathAllowed(method:string,path:string[]){
 if(path.length===0||path.some(part=>!part||part==='.'||part==='..'||part.includes('/')||part.includes('\\')))return false;
 const key=path.join('/');
 if(method==='GET')return ['session','overview','attention','asaas-events','health','metrics','restaurants','affiliates','payouts','support','audit'].includes(key)
  || path.length===2&&['restaurants','affiliates','support','payouts'].includes(path[0])
  || path.length===3&&path[0]==='affiliates'&&['pix-key','commissions','payouts'].includes(path[2])
  || path.length===3&&path[0]==='restaurants'&&['billing','billing-events'].includes(path[2]);
 if(method==='POST')return ['login','logout','setup','setup/confirm'].includes(key)
  || path.length===3&&path[0]==='restaurants'&&['suspend','resume','billing-retry','billing-check','billing-release'].includes(path[2])
  || path.length===3&&path[0]==='affiliates'&&['approve','reject','suspend','resume','payouts','reset'].includes(path[2])
  || path.length===3&&path[0]==='payouts'&&['paid','cancel'].includes(path[2])
  || path.length===3&&path[0]==='support'&&['assign','note','close','reopen'].includes(path[2])
  || path.length===3&&path[0]==='referrals'&&['approve','reject'].includes(path[2]);
 return false;
}
