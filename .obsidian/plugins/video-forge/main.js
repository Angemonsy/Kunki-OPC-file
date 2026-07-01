var $e=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var Le=Object.getOwnPropertyNames;var je=Object.prototype.hasOwnProperty;var We=(B,s)=>{for(var t in s)$e(B,t,{get:s[t],enumerable:!0})},Ge=(B,s,t,e)=>{if(s&&typeof s=="object"||typeof s=="function")for(let r of Le(s))!je.call(B,r)&&r!==t&&$e(B,r,{get:()=>s[r],enumerable:!(e=Ke(s,r))||e.enumerable});return B};var He=B=>Ge($e({},"__esModule",{value:!0}),B);var Ye={};We(Ye,{default:()=>Se});module.exports=He(Ye);var E=require("obsidian");var ae={geminiApiKey:"",geminiBaseUrl:"https://generativelanguage.googleapis.com/v1beta",geminiModel:"gemini-3.0-pro",claudeApiKey:"",claudeBaseUrl:"https://openclaw-api.com/v1",fishAudioApiKey:"",openaiApiKey:"",whisperModel:"whisper-1",falApiKey:"",whisperEngine:"local",localWhisperUrl:"http://localhost:5111",ttsEngine:"fish-audio",minimaxApiKey:"",minimaxGroupId:"",minimaxVoiceId:"",defaultVoiceId:"",voiceClones:[],remotionProjectPath:"",outputDir:"VideoForge/output",videoWidth:1920,videoHeight:1080,fps:30,renderOutputDir:"",nodejsPath:"",bgmFolderPath:"VideoForge/BGM",coverBgImagePath:"",coverOutputDir:"VideoForge/covers",coverWidth:1080,coverHeight:1920,coverFontFamily:"AlibabaPuHuiTi",coverBoldSize:96,coverNormalSize:64,coverFontColor:"#FFFFFF",coverOverlayOpacity:.4,coverDurationSec:.1,defaultStyle:{fontFamily:"AlibabaPuHuiTi",fontSize:48,fontColor:"#E5E5E7",bgColor:"#000000",accentColor:"#0A84FF",heroColor:"#FFFFFF",subColor:"#86868B",gradientFrom:"#0A84FF",gradientTo:"#5E5CE6",bgmVolume:.3,subtitleFontSize:46,subtitleBgColor:"rgba(0,0,0,0.65)",subtitleStyle:"bottom-bar",transition:"crossfade",transitionDuration:.5}};var I=require("obsidian");var Q=require("obsidian"),le=`\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u89C6\u9891\u5BFC\u6F14\u3002\u8BF7\u5C06\u4EE5\u4E0B\u811A\u672C\u62C6\u5206\u4E3A\u9002\u5408\u89C6\u9891\u5236\u4F5C\u7684\u573A\u666F\u3002

\u8981\u6C42\uFF1A
1. \u6BCF\u4E2A\u573A\u666F\u7684\u65C1\u767D\u65F6\u957F\u63A7\u5236\u5728 10-30 \u79D2\u4E4B\u95F4
2. \u6807\u6CE8\u6BCF\u4E2A\u573A\u666F\u7684\u60C5\u611F\u57FA\u8C03
3. \u3010\u91CD\u8981\u3011narration \u5FC5\u987B\u4E25\u683C\u4F7F\u7528\u539F\u6587\u5185\u5BB9\uFF0C\u53EA\u505A\u5206\u6BB5\uFF0C\u4E0D\u8981\u6539\u5199\u3001\u6982\u62EC\u3001\u6DA6\u8272\u6216\u6DFB\u52A0\u4EFB\u4F55\u539F\u6587\u6CA1\u6709\u7684\u6587\u5B57\u3002\u4F60\u7684\u4EFB\u52A1\u662F"\u5207\u5272"\u800C\u4E0D\u662F"\u91CD\u5199"\u3002\u9010\u5B57\u4FDD\u7559\u539F\u6587\u63AA\u8F9E\u548C\u8BED\u5E8F\u3002
4. \u3010\u91CD\u8981\u3011\u53EA\u8FD4\u56DE\u4E0B\u9762\u8981\u6C42\u7684\u5B57\u6BB5\uFF0C\u4E0D\u8981\u6DFB\u52A0\u989D\u5916\u5B57\u6BB5\u3002\u4FDD\u6301JSON\u7D27\u51D1\uFF0C\u4E0D\u8981\u5199\u957F\u63CF\u8FF0\u3002

\u8BF7\u4E25\u683C\u6309\u7167\u4EE5\u4E0B JSON \u683C\u5F0F\u8FD4\u56DE\uFF1A

{
  "scenes": [
    {
      "narration": "\u65C1\u767D\u6587\u672C\uFF08\u539F\u6587\uFF0C\u4E0D\u6539\u5199\uFF09",
      "estimated_duration": 15,
      "emotion": "neutral|excited|serious|humorous|dramatic|calm|inspiring|mysterious"
    }
  ]
}

\u811A\u672C\u5185\u5BB9\u5982\u4E0B\uFF1A
`,ne=class{constructor(s,t="gemini-2.5-flash",e="https://generativelanguage.googleapis.com/v1beta",r="",o=""){this.apiKey=s;let n=e.replace(/\/+$/,"");/^https?:\/\//i.test(n)||(n=`https://${n}`),n=n.replace(/\/models\/?$/,""),!n.includes("googleapis.com")&&!n.includes("/v1beta")&&!n.includes("/v1/")&&(n=`${n}/v1beta`),this.baseUrl=n,this.model=t,this.claudeApiKey=r||s;let i=(o||e).replace(/\/+$/,"");/^https?:\/\//i.test(i)||(i=`https://${i}`),i=i.replace(/\/chat\/completions\/?$/,""),i=i.replace(/\/v1\/?$/,""),i.endsWith("/v1")||(i=`${i}/v1`),this.claudeBaseUrl=i}isThirdParty(){return!this.baseUrl.includes("googleapis.com")}isClaude(){return this.model.toLowerCase().includes("claude")}async callClaude(s,t,e={}){var i,c,a,d,g,p,m;let r=`${this.claudeBaseUrl}/chat/completions`,o={model:this.model,max_tokens:e.maxTokens||16384,temperature:e.temperature||.4,messages:[{role:"system",content:s},{role:"user",content:t}]},n=3;for(let l=1;l<=n;l++)try{let y=(d=(a=(c=(i=(await(0,Q.requestUrl)({url:r,method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.claudeApiKey}`},body:JSON.stringify(o)})).json)==null?void 0:i.choices)==null?void 0:c[0])==null?void 0:a.message)==null?void 0:d.content;if(!y)throw new Error("Claude API \u8FD4\u56DE\u4E3A\u7A7A");return y}catch(u){let y=(u==null?void 0:u.status)||((g=u==null?void 0:u.response)==null?void 0:g.status)||0;if((y>=500||((p=u==null?void 0:u.message)==null?void 0:p.includes("timeout"))||((m=u==null?void 0:u.message)==null?void 0:m.includes("network")))&&l<n){let h=l*5e3;console.log(`[Claude] \u7B2C${l}\u6B21\u8BF7\u6C42\u5931\u8D25(${y})\uFF0C${h/1e3}\u79D2\u540E\u91CD\u8BD5...`),await new Promise(x=>setTimeout(x,h));continue}throw u}throw new Error("Claude API \u8BF7\u6C42\u5931\u8D25\uFF08\u5DF2\u91CD\u8BD53\u6B21\uFF09")}buildRequest(s,t){let e=this.isThirdParty()?`${this.baseUrl}/models/${s}:${t}`:`${this.baseUrl}/models/${s}:${t}?key=${this.apiKey}`,r={"Content-Type":"application/json"};return this.isThirdParty()&&(r.Authorization=`Bearer ${this.apiKey}`),{url:e,headers:r}}extractJSON(s){var p,m;console.log("[AI] \u539F\u59CB\u8FD4\u56DE\u957F\u5EA6:",s.length,"\u524D300\u5B57\u7B26:",s.substring(0,300));let t=s.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();t=t.replace(/\/\/[^\n]*/g,"").replace(/\/\*[\s\S]*?\*\//g,"").replace(/,\s*([}\]])/g,"$1"),t=t.replace(/[\u201c\u201d\u2018\u2019]/g,l=>l==="\u201C"||l==="\u201D"?'"':"'"),t=s.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim(),t=t.replace(/\/\/[^\n]*/g,"").replace(/\/\*[\s\S]*?\*\//g,"").replace(/,\s*([}\]])/g,"$1"),t=t.replace(/\{[\s]*\.\.\.[\s]*\}/g,"").replace(/,\s*,/g,",").replace(/\[\s*,/g,"[").replace(/,\s*\]/g,"]");let e="",r=!1,o=!1;for(let l=0;l<t.length;l++){let u=t[l];if(o){e+=u,o=!1;continue}if(u==="\\"&&r){e+=u,o=!0;continue}if(u==='"'){r=!r,e+=u;continue}if(r){if(u==="\u201C"||u==="\u201D"){e+="'";continue}if(u==="\u2018"||u==="\u2019"){e+="'";continue}if(u===`
`){e+="\\n";continue}if(u==="\r"){e+="\\r";continue}if(u==="	"){e+="\\t";continue}}e+=u}t=e;let n=l=>{try{return JSON.parse(l)}catch(v){}let u=l.replace(/,\s*([}\]])/g,"$1");try{return JSON.parse(u)}catch(v){}let y=u,f=(y.match(/\{/g)||[]).length,h=(y.match(/\}/g)||[]).length,x=(y.match(/\[/g)||[]).length,b=(y.match(/\]/g)||[]).length;if(f>h||x>b){y=y.replace(/,\s*"[^"]*"?\s*:?\s*[^}\]]*$/,"");for(let v=0;v<x-b;v++)y+="]";for(let v=0;v<f-h;v++)y+="}";try{return JSON.parse(y)}catch(v){}}return null},i=n(t);if(i)return i;console.log("[AI] \u76F4\u63A5\u89E3\u6790\u5931\u8D25\uFF0C\u5C1D\u8BD5\u63D0\u53D6\u5927\u62EC\u53F7/\u65B9\u62EC\u53F7");let c=t.indexOf("{"),a=t.lastIndexOf("}");if(c>=0&&a>c){let l=t.substring(c,a+1),u=n(l);if(u)return u;try{JSON.parse(l)}catch(y){let f=parseInt(((m=(p=y.message)==null?void 0:p.match(/position (\d+)/))==null?void 0:m[1])||"0");console.log("[AI] \u89E3\u6790\u5931\u8D25\u4F4D\u7F6E:",f,"\u9644\u8FD1:",l.substring(Math.max(0,f-50),f+50))}}let d=t.indexOf("["),g=t.lastIndexOf("]");if(d>=0&&g>d){let l=n(t.substring(d,g+1));if(l)return l}throw console.log("[AI] \u5B8C\u6574\u539F\u59CB\u8FD4\u56DE:",t.substring(0,2e3)),new Error("\u65E0\u6CD5\u4ECE AI \u8FD4\u56DE\u4E2D\u63D0\u53D6\u6709\u6548 JSON")}async splitScenes(s){var t,e,r,o,n,i,c,a,d,g,p,m,l;if(!this.apiKey&&!this.claudeApiKey)throw new Error("API Key \u672A\u914D\u7F6E");try{let u;if(this.isClaude())u=await this.callClaude("\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u89C6\u9891\u5BFC\u6F14\u548C\u7F16\u5267\u3002\u8BF7\u4E25\u683C\u6309\u7167\u7528\u6237\u8981\u6C42\u7684 JSON \u683C\u5F0F\u8FD4\u56DE\u7ED3\u679C\uFF0C\u4E0D\u8981\u6DFB\u52A0\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\u3002",le+s,{temperature:.7,maxTokens:32768});else{let{url:f,headers:h}=this.buildRequest(this.model,"generateContent"),x={contents:[{parts:[{text:le+s}]}],generationConfig:{temperature:.7,topP:.9,maxOutputTokens:32768,responseMimeType:"application/json"},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_NONE"}]};if(u=(i=(n=(o=(r=(e=(t=(await(0,Q.requestUrl)({url:f,method:"POST",headers:h,body:JSON.stringify(x)})).json)==null?void 0:t.candidates)==null?void 0:e[0])==null?void 0:r.content)==null?void 0:o.parts)==null?void 0:n[0])==null?void 0:i.text,!u)throw new Error("Gemini \u8FD4\u56DE\u4E3A\u7A7A")}let y=this.extractJSON(u);if(!y.scenes||!Array.isArray(y.scenes))throw new Error("AI \u8FD4\u56DE\u683C\u5F0F\u9519\u8BEF\uFF1A\u7F3A\u5C11 scenes \u6570\u7EC4");return y.scenes.map((f,h)=>({id:`scene-${String(h+1).padStart(3,"0")}`,index:h,narration:f.narration,visualPrompt:f.visual_prompt||"",duration:f.estimated_duration||15,emotion:f.emotion||"neutral",notes:f.notes||"",bgImageKeywords:f.bg_keywords||[]}))}catch(u){if((c=u.message)!=null&&c.includes("API Key"))throw u;if(this.claudeApiKey&&this.claudeBaseUrl){console.warn("[AI] \u573A\u666F\u62C6\u89E3\u5931\u8D25\uFF0C\u5C1D\u8BD5\u5907\u7528 Claude \u63A5\u53E3:",u.message);try{let y=await this.callClaude("\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u89C6\u9891\u5BFC\u6F14\u3002\u8BF7\u4E25\u683C\u6309\u7167\u7528\u6237\u8981\u6C42\u7684 JSON \u683C\u5F0F\u8FD4\u56DE\u7ED3\u679C\uFF0C\u4E0D\u8981\u6DFB\u52A0\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\u3002",le+s,{temperature:.7,maxTokens:32768}),f=this.extractJSON(y);if(!f.scenes||!Array.isArray(f.scenes))throw new Error("\u5907\u7528\u63A5\u53E3\u7F3A\u5C11 scenes");return console.log("[AI] \u5907\u7528 Claude \u63A5\u53E3\u6210\u529F\uFF0C\u62C6\u51FA",f.scenes.length,"\u4E2A\u573A\u666F"),f.scenes.map((h,x)=>({id:`scene-${String(x+1).padStart(3,"0")}`,index:x,narration:h.narration,visualPrompt:h.visual_prompt||"",duration:h.estimated_duration||15,emotion:h.emotion||"neutral",notes:h.notes||"",bgImageKeywords:h.bg_keywords||[]}))}catch(y){throw new Error(`\u573A\u666F\u62C6\u89E3\u5931\u8D25\uFF08\u4E24\u4E2A\u63A5\u53E3\u5747\u5931\u8D25\uFF09: ${y.message}`)}}console.warn("[AI] \u573A\u666F\u62C6\u89E3\u9996\u6B21\u5931\u8D25\uFF0C\u81EA\u52A8\u91CD\u8BD5:",u.message);try{let{url:y,headers:f}=this.buildRequest(this.model,"generateContent"),h={contents:[{parts:[{text:le+s}]}],generationConfig:{temperature:.5,topP:.9,maxOutputTokens:32768,responseMimeType:"application/json"},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_NONE"}]},b=(l=(m=(p=(g=(d=(a=(await(0,Q.requestUrl)({url:y,method:"POST",headers:f,body:JSON.stringify(h)})).json)==null?void 0:a.candidates)==null?void 0:d[0])==null?void 0:g.content)==null?void 0:p.parts)==null?void 0:m[0])==null?void 0:l.text;if(!b)throw new Error("Gemini \u91CD\u8BD5\u8FD4\u56DE\u4E3A\u7A7A");let v=this.extractJSON(b);if(!v.scenes||!Array.isArray(v.scenes))throw new Error("\u91CD\u8BD5\u540E\u4ECD\u7F3A\u5C11 scenes \u6570\u7EC4");return v.scenes.map((C,F)=>({id:`scene-${String(F+1).padStart(3,"0")}`,index:F,narration:C.narration,visualPrompt:C.visual_prompt||"",duration:C.estimated_duration||15,emotion:C.emotion||"neutral",notes:C.notes||"",bgImageKeywords:C.bg_keywords||[]}))}catch(y){throw new Error(`\u573A\u666F\u62C6\u89E3\u5931\u8D25\uFF08\u5DF2\u91CD\u8BD5\uFF09: ${y.message}`)}}}async refineNarration(s,t){var c,a,d,g,p;let e=`\u8BF7\u4F18\u5316\u4EE5\u4E0B\u89C6\u9891\u65C1\u767D\u6587\u672C\uFF0C\u4F7F\u5176\u66F4\u9002\u5408${t}\u7684\u8BED\u8C03\u6717\u8BFB\uFF0C\u8981\u6C42\u81EA\u7136\u6D41\u7545\uFF0C\u9002\u5408 TTS \u5408\u6210\u3002\u53EA\u8FD4\u56DE\u4F18\u5316\u540E\u7684\u6587\u672C\uFF0C\u4E0D\u8981\u5176\u4ED6\u5185\u5BB9\u3002

\u539F\u6587\uFF1A${s}`;if(this.isClaude())return await this.callClaude("\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u89C6\u9891\u65C1\u767D\u7F16\u8F91\u3002",e,{temperature:.5,maxTokens:2048});let{url:r,headers:o}=this.buildRequest(this.model,"generateContent");return((p=(g=(d=(a=(c=(await(0,Q.requestUrl)({url:r,method:"POST",headers:o,body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.5,maxOutputTokens:2048}})})).json.candidates)==null?void 0:c[0])==null?void 0:a.content)==null?void 0:d.parts)==null?void 0:g[0])==null?void 0:p.text)||s}async generateSlides(s,t){if(!this.apiKey&&!this.claudeApiKey)throw new Error("API Key \u672A\u914D\u7F6E\uFF08Gemini \u6216 Claude \u81F3\u5C11\u914D\u4E00\u4E2A\uFF09");let e=s.split(/\n\n+/).filter(o=>o.trim().length>0),r=15;if(e.length>20){console.log(`[generateSlides] SRT has ${e.length} entries, splitting into chunks of ${r}`);let o=[],n=null;for(let i=0;i<e.length;i+=r){let a=e.slice(i,i+r).join(`

`),d=i===0?t:void 0;console.log(`[generateSlides] Generating chunk ${Math.floor(i/r)+1}/${Math.ceil(e.length/r)} (entries ${i+1}-${Math.min(i+r,e.length)})`);let g=await this._generateSlidesChunk(a,d);i===0&&g.topTitle&&(n=g.topTitle),o.push(...g.slides)}for(let i=1;i<o.length;i++)o[i].start<o[i-1].end&&(o[i].start=o[i-1].end);return{slides:o,topTitle:n}}return this._generateSlidesChunk(s,t)}async _generateSlidesChunk(s,t){var i,c,a,d,g,p,m;let{url:e,headers:r}=this.buildRequest(this.model,"generateContent"),o=t?`

\u539F\u59CB\u6587\u6848\uFF08\u7528\u4E8E\u63D0\u70BC\u5173\u952E\u8BCD\uFF0C\u4E0D\u8981\u7167\u642C\u539F\u6587\uFF09\uFF1A

${t}`:"",n=`\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u77ED\u89C6\u9891\u5B57\u5E55\u5BFC\u6F14\u3002\u6211\u7ED9\u4F60\u4E00\u4E2A SRT \u5B57\u5E55\u6587\u4EF6\u548C\u539F\u59CB\u6587\u6848\uFF0C\u8BF7\u4F60\u751F\u6210 PPT \u98CE\u683C\u7684 slides \u6570\u7EC4\u3002

\u26A0\uFE0F \u6700\u9AD8\u4F18\u5148\u7EA7\u89C4\u5219\uFF08\u8FDD\u53CD\u4EFB\u4F55\u4E00\u6761\u5373\u4E3A\u5B8C\u5168\u5931\u8D25\uFF09\uFF1A

\u3010PPT\u5927\u5B57 \u2260 \u5B57\u5E55\u3011
- PPT\u5927\u5B57\u7684\u4F5C\u7528\u662F"\u89C6\u89C9\u9524"\uFF0C\u75282-4\u4E2A\u5B57\u7684\u5173\u952E\u8BCD\u7838\u8FDB\u89C2\u4F17\u8111\u5B50\u91CC
- \u5B57\u5E55\u662F\u5B8C\u6574\u53E5\u5B50\u7ED9\u4EBA\u8BFB\u7684\uFF0CPPT\u5927\u5B57\u662F\u5173\u952E\u8BCD\u7ED9\u4EBA"\u770B\u4E00\u773C\u5C31\u8BB0\u4F4F"\u7684
- \u5982\u679C\u4F60\u7684 slides text \u548C\u5B57\u5E55\u539F\u6587\u4E00\u6837\u6216\u63A5\u8FD1\uFF0C\u5C31\u662F\u5B8C\u5168\u5931\u8D25

\u3010\u5173\u952E\u8BCD\u63D0\u70BC\u65B9\u6CD5\u3011
1. \u627E\u5230\u8FD9\u53E5\u8BDD\u7684\u6838\u5FC3\u540D\u8BCD/\u52A8\u8BCD/\u6570\u5B57\uFF0C\u53EA\u4FDD\u7559\u5B83\u4EEC
2. \u5220\u6389\u6240\u6709\u865A\u8BCD\uFF1A\u6211\u3001\u4F60\u3001\u4ED6\u3001\u7684\u3001\u4E86\u3001\u5728\u3001\u662F\u3001\u6709\u3001\u5C31\u3001\u90FD\u3001\u4E5F\u3001\u8FD8\u3001\u628A\u3001\u88AB\u3001\u8BA9\u3001\u7ED9\u3001\u5230\u3001\u53BB\u3001\u6765\u3001\u80FD\u3001\u4F1A\u3001\u8981\u3001\u53EF\u4EE5\u3001\u56E0\u4E3A\u3001\u6240\u4EE5\u3001\u4F46\u662F\u3001\u7136\u540E\u3001\u5982\u679C\u3001\u867D\u7136\u3001\u57FA\u672C\u4E0A\u3001\u5B9E\u5728\u3001\u5B8C\u5168\u3001\u5176\u5B9E
3. \u5220\u6389\u6240\u6709\u53E3\u8BED\u586B\u5145\uFF1A\u6309\u7406\u8BF4\u3001\u8BF4\u767D\u4E86\u3001\u8FD9\u4E1C\u897F\u3001\u90A3\u73A9\u610F\u513F\u3001\u600E\u4E48\u8BF4\u5462
4. \u6700\u7EC8\u7ED3\u679C\u5FC5\u987B\u662F\u4E00\u4E2A\u53EF\u8BFB\u7684\u77ED\u8BED\uFF0C\u4E0D\u662F\u4E71\u62FC\u7684\u6563\u5B57

\u63D0\u70BC\u793A\u4F8B\uFF08\u5FC5\u987B\u4E25\u683C\u9075\u5B88\uFF09\uFF1A
  \u539F\u6587"\u6211\u57FA\u672C\u4E0A\u5C31\u6CA1\u7761\u597D\u89C9" \u2192 \u274C"\u57FA\u672C\u5C31\u6CA1\u7761\u597D" \u274C"\u6CA1\u7761\u597D" \u2192 \u2705"\u5931\u7720" \u6216 \u2705"\u6CA1\u7761\u597D\u89C9"
  \u539F\u6587"\u56E0\u4E3A\u4E00\u6B3E\u53EB\u505AOpenClaw\u7684AI\u5DE5\u5177" \u2192 \u274C"\u53EB\u505AOpenClaw" \u2192 \u2705"OpenClaw"
  \u539F\u6587"\u5B9E\u5728\u592A\u706B\u4E86" \u2192 \u274C"\u5B9E\u5728\u592A\u706B" \u2192 \u2705"\u592A\u706B\u4E86" \u6216 \u2705"\u7206\u706B"
  \u539F\u6587"\u628A\u6211\u6574\u7684\u597D\u7126\u8651\u554A" \u2192 \u274C"\u7126\u8651" \u2192 \u2705"\u597D\u7126\u8651"
  \u539F\u6587"\u8FD9\u4E1C\u897F\u5728GitHub\u4E0A\u670918\u4E07Star" \u2192 \u274C"GitHub18\u4E07" \u2192 \u2705"18\u4E07Star"
  \u539F\u6587"\u5B83\u53EF\u4EE5\u81EA\u52A8\u64CD\u63A7\u4F60\u7684\u7535\u8111" \u2192 \u274C"\u81EA\u52A8\u64CD\u63A7" \u2192 \u2705"\u64CD\u63A7\u7535\u8111"
  \u539F\u6587"\u751A\u81F3\u642D\u5EFA\u51FA\u4E00\u5806AI\u653E\u5728\u7FA4\u91CC\u50CF\u771F\u4EBA\u4E00\u6837" \u2192 \u274C"\u642D\u5EFAAI" \u2192 \u2705"AI\u7FA4\u804A"
  \u539F\u6587"\u5E03\u7F6E\u5DE5\u4F5C\u4EFB\u52A1\u548C\u4EA4\u63A5" \u2192 \u274C"\u5E03\u7F6E\u5DE5\u4F5C\u4EFB\u52A1\u4EA4" \u2192 \u2705"\u5E03\u7F6E\u4EFB\u52A1"
  \u539F\u6587"\u57FA\u672C\u4E0A\u4F60\u5750\u5728\u7535\u8111\u524D\u80FD\u5E72\u7684\u4E8B" \u2192 \u274C"\u5750\u7535\u8111" \u2192 \u2705"\u7535\u8111\u80FD\u5E72\u7684\u4E8B"
  \u539F\u6587"\u8BA9AI\u5B8C\u5168\u66FF\u6211\u5E72\u6D3B" \u2192 \u274C"AI\u66FF\u5E72\u6D3B" \u2192 \u2705"AI\u66FF\u6211\u5E72\u6D3B"
  \u539F\u6587"\u4EBA\u683C\u6587\u4EF6\u600E\u4E48\u5199" \u2192 \u274C"\u4EBA\u683C\u6587\u5199" \u2192 \u2705"\u4EBA\u683C\u6587\u4EF6"
  \u539F\u6587"\u6280\u672F\u4E0A\u5B8C\u5168\u53EF\u884C" \u2192 \u2705"\u6280\u672F\u53EF\u884C"
  \u539F\u6587"\u6211\u7ED9\u6BCF\u4E2AAI\u90FD\u914D\u4E86\u4E00\u5957\u57F9\u8BAD\u624B\u518C" \u2192 \u274C"\u7ED9\u6BCFAI\u90FD\u914D\u57F9" \u2192 \u2705"AI\u57F9\u8BAD\u624B\u518C"
  \u539F\u6587"\u5C31\u50CF\u4E00\u4E2A\u4E00\u5E74\u90FD\u6CA1\u8FD0\u52A8\u8FC7\u7684\u4EBA" \u2192 \u274C"\u4E00\u5E74\u8FD0\u52A8\u4EBA" \u2192 \u2705"\u4E00\u5E74\u6CA1\u8FD0\u52A8"
  \u539F\u6587"\u8FD9\u4EF6\u4E8B\u8DDFOpenClaw\u6CA1\u5173\u7CFB" \u2192 \u274C"\u4E8BOpenClaw\u5173\u7CFB" \u2192 \u2705"\u8DDFOpenClaw\u65E0\u5173"

\u3010\u5173\u952E\u68C0\u9A8C\u6807\u51C6\u3011
- \u628A\u4F60\u751F\u6210\u7684 text \u5927\u58F0\u8BFB\u51FA\u6765\uFF0C\u5982\u679C\u8BFB\u4E0D\u901A\u987A\u3001\u50CF\u4E71\u7801\uFF0C\u5C31\u662F\u5931\u8D25
- \u6BCF\u4E2A text \u5FC5\u987B\u662F\u4E00\u4E2A\u6709\u610F\u4E49\u7684\u77ED\u8BED\uFF0C\u80FD\u8BA9\u4EBA\u4E00\u773C\u770B\u61C2
- \u5B81\u53EF\u591A\u7559\u4E00\u4E24\u4E2A\u5B57\u8BA9\u77ED\u8BED\u901A\u987A\uFF0C\u4E5F\u4E0D\u8981\u4E3A\u4E86\u7CBE\u7B80\u800C\u53D8\u6210\u4E71\u7801

\u3010\u683C\u5F0F\u89C4\u5219\u3011
- \u6BCF\u884C\u6700\u591A 8 \u4E2A\u89C6\u89C9\u5355\u4F4D\uFF08\u4E2D\u6587\u5B57=1\u5355\u4F4D\uFF0C\u82F1\u6587\u5355\u8BCD=1\u5355\u4F4D\uFF0C\u6570\u5B57\u7EC4=1\u5355\u4F4D\uFF09\uFF0C\u8D85\u8FC7\u5373\u4E3A\u5931\u8D25
- \u26A0\uFE0F \u7EDD\u5BF9\u7981\u6B62\u622A\u65AD\u53E5\u5B50\uFF01\u5982\u679C\u539F\u6587\u592A\u957F\uFF0C\u5FC5\u987B\u63D0\u70BC\u5173\u952E\u8BCD\uFF0C\u4E0D\u80FD\u76F4\u63A5\u4ECE\u53E5\u5B50\u4E2D\u95F4\u780D\u65AD\uFF01
  - \u274C "\u6628\u5929\u53D1\u4E00\u6761\u5173\u4E8E\u817E"\uFF08\u53E5\u5B50\u780D\u65AD\uFF0C\u4E0D\u77E5\u6240\u4E91\uFF09
  - \u274C "\u8BF4\u817E\u8BAF\u6084\u6084\u505A\u4E2A\u4E1C"\uFF08\u53E5\u5B50\u780D\u65AD\uFF0C\u4E0D\u77E5\u6240\u4E91\uFF09
  - \u2705 "\u817E\u8BAFQClaw"\uFF08\u63D0\u70BC\u6838\u5FC3\u5173\u952E\u8BCD\uFF09
  - \u2705 "\u4E00\u952E\u90E8\u7F72"\uFF08\u63D0\u70BC\u6838\u5FC3\u52A8\u4F5C\uFF09
- \u82F1\u6587\u5355\u8BCD\u5FC5\u987B\u5B8C\u6574\uFF0C\u7981\u6B62\u62C6\u65AD\uFF08OpenClaw \u4E0D\u80FD\u62C6\u6210 Open + Claw \u6216 OpenCla + w\uFF09
- \u4E2D\u6587\u8BCD\u8BED\u5FC5\u987B\u5B8C\u6574\uFF0C\u7981\u6B62\u62C6\u65AD\uFF08"\u77E5\u8BC6\u5E93"\u4E0D\u80FD\u62C6\u6210"\u77E5\u8BC6" + "\u5E93"\u5206\u4E24\u884C\uFF09
- \u7981\u6B62\u51FA\u73B0\u4EFB\u4F55\u6807\u70B9\u7B26\u53F7
- \u6BCF\u884C\u5FC5\u987B\u4ECE\u539F\u6587\u4E2D\u63D0\u53D6\u6838\u5FC3\u8BCD\uFF0C\u5141\u8BB8\u540C\u4E49\u7CBE\u7B80\uFF08\u5982"\u5B9E\u5728\u592A\u706B\u4E86"\u2192"\u7206\u706B"\uFF09\uFF0C\u4F46\u4E0D\u80FD\u51ED\u7A7A\u7F16\u9020\u539F\u6587\u6CA1\u6709\u7684\u6982\u5FF5
- \u6BCF\u884C\u6587\u5B57\u5FC5\u987B\u662F\u4E00\u4E2A\u5B8C\u6574\u7684\u3001\u8BFB\u5F97\u901A\u7684\u77ED\u8BED\uFF0C\u5982\u679C\u5927\u58F0\u8BFB\u51FA\u6765\u4E0D\u901A\u987A\u5C31\u662F\u5931\u8D25

\u89C6\u89C9\u5355\u4F4D\u8BA1\u7B97\u793A\u4F8B\uFF1A
- "18\u4E07Star" = 2\u5355\u4F4D\uFF0818\u4E07=1, Star=1\uFF09\u2705
- "OpenClaw" = 1\u5355\u4F4D \u2705
- "AI\u66FF\u6211\u5E72\u6D3B" = 5\u5355\u4F4D\uFF08AI=1, \u66FF=1, \u6211=1, \u5E72=1, \u6D3B=1\uFF09\u2705
- "\u64CD\u63A7\u7535\u8111" = 4\u5355\u4F4D \u2705

\u3010\u65F6\u95F4\u6233\u89C4\u5219\u3011
A. slides \u5FC5\u987B\u4E25\u683C\u6309\u65F6\u95F4\u9012\u589E\u6392\u5217\uFF0C\u540E\u4E00\u5C4F\u7684 start >= \u524D\u4E00\u5C4F\u7684 end
B. \u26A0\uFE0F slides \u5FC5\u987B\u8FDE\u7EED\u8986\u76D6\u6574\u4E2A SRT \u65F6\u95F4\u8303\u56F4\uFF0C\u4ECE\u7B2C\u4E00\u6761\u5B57\u5E55\u7684\u5F00\u59CB\u5230\u6700\u540E\u4E00\u6761\u5B57\u5E55\u7684\u7ED3\u675F\uFF0C\u4E0D\u5141\u8BB8\u6709\u4EFB\u4F55\u9057\u6F0F\uFF01\u6BCF\u4E00\u79D2\u90FD\u5FC5\u987B\u88AB\u67D0\u4E2A slide \u8986\u76D6\uFF01
C. \u76F8\u90BB slides \u4E4B\u95F4\u4E0D\u5141\u8BB8\u6709\u8D85\u8FC7 0.5 \u79D2\u7684\u7A7A\u767D\uFF0C\u5982\u679C\u6709\u7A7A\u767D\u5C31\u662F\u5931\u8D25
D. slides \u4E4B\u95F4\u4E0D\u5141\u8BB8\u65F6\u95F4\u91CD\u53E0
E. \u6BCF\u5C4F\u65F6\u957F 2-6 \u79D2\uFF0C\u76F4\u63A5\u53D6 SRT \u6761\u76EE\u7684\u65F6\u95F4\u6233\u4F5C\u4E3A start/end
F. \u751F\u6210\u5B8C\u6BD5\u540E\uFF0C\u81EA\u68C0\uFF1A\u7B2C\u4E00\u4E2A slide \u7684 start \u662F\u5426 \u2248 SRT \u7B2C\u4E00\u6761\u7684 start\uFF0C\u6700\u540E\u4E00\u4E2A slide \u7684 end \u662F\u5426 \u2248 SRT \u6700\u540E\u4E00\u6761\u7684 end

\u89C4\u5219\uFF1A
1. \u6BCF\u5C4F\uFF08slide\uFF09\u5BF9\u5E94 SRT \u4E2D\u8FDE\u7EED\u7684 1-3 \u6761\u5B57\u5E55\uFF0Cstart \u53D6\u7B2C\u4E00\u6761\u7684\u5F00\u59CB\u65F6\u95F4\uFF0Cend \u53D6\u6700\u540E\u4E00\u6761\u7684\u7ED3\u675F\u65F6\u95F4
2. \u6BCF\u5C4F 1-3 \u884C\uFF0C\u6BCF\u884C\u662F\u63D0\u70BC\u51FA\u7684\u5173\u952E\u77ED\u8BED\uFF08\u4E0D\u662F\u5B8C\u6574\u53E5\u5B50\uFF09
3. \u6BCF\u884C\u6700\u591A 8 \u4E2A\u89C6\u89C9\u5355\u4F4D\uFF08\u4E2D\u6587\u5B57=1\uFF0C\u82F1\u6587\u5355\u8BCD=1\uFF0C\u6570\u5B57\u7EC4=1\uFF09\uFF0C\u8D8A\u7CBE\u70BC\u8D8A\u597D\uFF0C\u65E0\u6807\u70B9
4. type \u7C7B\u578B\uFF1A
   - "hero": \u6838\u5FC3\u5173\u952E\u8BCD/\u6570\u5B57\uFF0C\u6700\u5927\u6700\u9192\u76EE\uFF0Csize 96-130
   - "accent": \u91CD\u8981\u77ED\u8BED\uFF0Csize 72-88
   - "gradient": \u5E26\u6E10\u53D8\u7684\u5F3A\u8C03\u8BCD\uFF0Csize 72-96
   - "normal": \u666E\u901A\u63CF\u8FF0\uFF0Csize 60-68
   - "sub": \u8FC7\u6E21\u8BCD/\u5F15\u5BFC\u8BCD\uFF0Csize 44-52
5. delay: \u7B2C\u4E00\u884C 0\uFF0C\u540E\u7EED\u884C\u9012\u589E 0.12
6. \u5173\u952E\u6570\u5B57\u5FC5\u987B\u7528 hero\uFF08\u5982"18\u4E07Star"\u2192 hero\uFF09
7. \u52A8\u4F5C/\u6D41\u7A0B\u7528\u7BAD\u5934\u8FDE\u63A5\uFF08\u5982"\u70ED\u70B9\u2192\u9009\u9898\u2192\u6587\u6848"\u2192 accent\uFF09
8. \u95EE\u53E5\u7528 accent \u7C7B\u578B
9. \u8FC7\u6E21\u8BCD\uFF08"\u6309\u7406\u8BF4"\u3001"\u4F46\u662F"\u3001"\u6240\u4EE5"\uFF09\u7528 sub
10. \u6BCF\u5C4F\u8981\u6709\u89C6\u89C9\u5C42\u6B21\u611F\uFF1A\u5927\u5C0F\u5B57\u642D\u914D\uFF0C\u4E0D\u8981\u5168\u662F\u540C\u4E00\u79CD type

\u5B8C\u6574\u63D0\u70BC\u793A\u4F8B\uFF1A
\u539F\u6587"\u6211\u670940\u591A\u4E2AAI\u667A\u80FD\u4F53\u5E2E\u6211\u5199\u6587\u6848\uFF0C\u4ECE\u70ED\u70B9\u8FFD\u8E2A\u3001\u9009\u9898\u5206\u6790\u5230\u6392\u7248\u53D1\u5E03"
\u2192 \u63D0\u70BC\u4E3A\uFF1A
  line1: {text: "40\u4E2AAI\u667A\u80FD\u4F53", type: "hero", size: 110, delay: 0}
  line2: {text: "\u70ED\u70B9\u2192\u9009\u9898\u2192\u6392\u7248", type: "accent", size: 68, delay: 0.12}
  line3: {text: "\u5168\u94FE\u8DEF\u751F\u4EA7\u7EBF", type: "gradient", size: 80, delay: 0.24}

\u8BF7\u4E25\u683C\u6309\u4EE5\u4E0B JSON \u683C\u5F0F\u8FD4\u56DE\uFF0C\u4E0D\u8981\u6DFB\u52A0\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\uFF1A

{
  "slides": [
    {
      "start": 0.0,
      "end": 3.5,
      "lines": [
        {"text": "\u5173\u952E\u8BCD", "type": "hero", "size": 110, "delay": 0},
        {"text": "\u77ED\u8BED", "type": "accent", "size": 72, "delay": 0.12}
      ]
    }
  ]
}

SRT \u5B57\u5E55\u5185\u5BB9\uFF1A

${s}${o}`;try{let l;if(this.isClaude())l=await this.callClaude("\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u77ED\u89C6\u9891\u5B57\u5E55\u5BFC\u6F14\u3002\u8BF7\u4E25\u683C\u6309\u7167\u7528\u6237\u8981\u6C42\u7684 JSON \u683C\u5F0F\u8FD4\u56DE slides \u6570\u7EC4\uFF0C\u4E0D\u8981\u6DFB\u52A0\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\u3002",n,{temperature:.4,maxTokens:65536});else if(l=(p=(g=(d=(a=(c=(i=(await(0,Q.requestUrl)({url:e,method:"POST",headers:r,body:JSON.stringify({contents:[{parts:[{text:n}]}],generationConfig:{temperature:.4,topP:.9,maxOutputTokens:65536,responseMimeType:"application/json"},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_NONE"}]})})).json)==null?void 0:i.candidates)==null?void 0:c[0])==null?void 0:a.content)==null?void 0:d.parts)==null?void 0:g[0])==null?void 0:p.text,!l)throw new Error("Gemini \u8FD4\u56DE\u4E3A\u7A7A");let u=this.extractJSON(l);if(!u.slides||!Array.isArray(u.slides))throw new Error("AI \u8FD4\u56DE\u683C\u5F0F\u9519\u8BEF\uFF1A\u7F3A\u5C11 slides \u6570\u7EC4");return{slides:u.slides,topTitle:u.topTitle||null}}catch(l){throw(m=l.message)!=null&&m.includes("API Key")?l:new Error(`slides \u751F\u6210\u5931\u8D25: ${l.message}`)}}async refineSlides(s){var n,i,c,a,d,g;if(!this.apiKey&&!this.claudeApiKey)throw new Error("API Key \u672A\u914D\u7F6E\uFF08Gemini \u6216 Claude \u81F3\u5C11\u914D\u4E00\u4E2A\uFF09");let{url:t,headers:e}=this.buildRequest(this.model,"generateContent"),o=`\u4F60\u662F\u77ED\u89C6\u9891\u5B57\u5E55\u5BFC\u6F14\u3002\u4EE5\u4E0B slides \u7684 text \u548C\u5B57\u5E55\u539F\u6587\u592A\u63A5\u8FD1\uFF0C\u9700\u8981\u91CD\u65B0\u63D0\u70BC\u5173\u952E\u8BCD\u3002

\u26A0\uFE0F \u89C4\u5219\uFF1A
- PPT\u5927\u5B57\u662F"\u89C6\u89C9\u9524"\uFF0C\u75282-4\u4E2A\u5B57\u7684\u5173\u952E\u8BCD\u7838\u8FDB\u89C2\u4F17\u8111\u5B50\u91CC
- \u5FC5\u987B\u4ECE\u539F\u6587\u4E2D\u63D0\u53D6\u6838\u5FC3\u540D\u8BCD/\u52A8\u8BCD/\u6570\u5B57\uFF0C\u5220\u6389\u6240\u6709\u865A\u8BCD\u548C\u53E3\u8BED\u586B\u5145
- \u6BCF\u4E2A text \u5FC5\u987B\u662F\u4E00\u4E2A\u6709\u610F\u4E49\u7684\u77ED\u8BED\uFF0C\u80FD\u8BA9\u4EBA\u4E00\u773C\u770B\u61C2
- \u6BCF\u884C\u6700\u591A8\u4E2A\u89C6\u89C9\u5355\u4F4D\uFF08\u4E2D\u6587\u5B57=1\uFF0C\u82F1\u6587\u5355\u8BCD=1\uFF0C\u6570\u5B57\u7EC4=1\uFF09
- \u26A0\uFE0F \u7EDD\u5BF9\u7981\u6B62\u622A\u65AD\u53E5\u5B50\uFF01\u5FC5\u987B\u63D0\u70BC\u5173\u952E\u8BCD\uFF0C\u4E0D\u80FD\u4ECE\u53E5\u5B50\u4E2D\u95F4\u780D\u65AD\uFF08\u5982"\u6628\u5929\u53D1\u4E00\u6761\u5173\u4E8E\u817E"\u662F\u5931\u8D25\u7684\uFF0C\u5E94\u8BE5\u63D0\u70BC\u4E3A"\u817E\u8BAFQClaw"\uFF09
- \u7981\u6B62\u6807\u70B9\u7B26\u53F7
- \u82F1\u6587\u5355\u8BCD\u5FC5\u987B\u5B8C\u6574

\u9700\u8981\u4FEE\u590D\u7684 slides\uFF1A
${s.map((p,m)=>`${m+1}. [${p.start.toFixed(1)}-${p.end.toFixed(1)}\u79D2] \u5F53\u524Dtext: "${p.text}" \u2190 \u5B57\u5E55\u539F\u6587: "${p.subtitleText}"`).join(`
`)}

\u8BF7\u8FD4\u56DE JSON \u6570\u7EC4\uFF0C\u6BCF\u9879\u683C\u5F0F\uFF08index \u4ECE 1 \u5F00\u59CB\uFF0C\u5BF9\u5E94\u4E0A\u9762\u5217\u8868\u7684\u7F16\u53F7\uFF09\uFF1A
{"index": 1, "lines": [{"text": "\u63D0\u70BC\u540E\u7684\u5173\u952E\u8BCD", "type": "hero", "size": 96}]}

type \u53EF\u9009\uFF1Ahero(96-130) / accent(72-88) / gradient(72-96) / normal(60-68) / sub(44-52)
\u6BCF\u5C4F1-3\u884C`;try{let p;return this.isClaude()?p=await this.callClaude("\u4F60\u662F\u77ED\u89C6\u9891\u5B57\u5E55\u5BFC\u6F14\u3002\u8BF7\u4E25\u683C\u6309\u7167\u8981\u6C42\u7684 JSON \u6570\u7EC4\u683C\u5F0F\u8FD4\u56DE\u7ED3\u679C\u3002",o,{temperature:.7,maxTokens:4096}):p=((g=(d=(a=(c=(i=(n=(await(0,Q.requestUrl)({url:t,method:"POST",headers:e,body:JSON.stringify({contents:[{parts:[{text:o}]}],generationConfig:{temperature:.7,maxOutputTokens:4096,responseMimeType:"application/json"},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_NONE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_NONE"}]})})).json)==null?void 0:n.candidates)==null?void 0:i[0])==null?void 0:c.content)==null?void 0:a.parts)==null?void 0:d[0])==null?void 0:g.text)||"",this.extractJSON(p)}catch(p){throw new Error(`refineSlides \u5931\u8D25: ${p.message}`)}}};var ce=require("obsidian"),Ue="https://api.fish.audio/v1/tts",Je="https://api.fish.audio/model",ke={neutral:{tag:"",speed:1.2},excited:{tag:"(excited)",speed:1.25},serious:{tag:"(serious)",speed:1.1},humorous:{tag:"(amused)",speed:1.2},dramatic:{tag:"(moved)",speed:1.05},calm:{tag:"(relaxed)",speed:1.1},inspiring:{tag:"(confident)",speed:1.2},mysterious:{tag:"(curious)",speed:1.05}},de=class{constructor(s){this.apiKey=s}async synthesize(s,t){var p,m;if(!this.apiKey)throw new Error("Fish Audio API Key \u672A\u914D\u7F6E");if(!t)throw new Error("\u8BF7\u5148\u514B\u9686\u4E00\u4E2A\u8BED\u97F3\u6216\u9009\u62E9\u58F0\u97F3\u6A21\u578B");let e=ke[s.emotion]||ke.neutral,r=e.tag?`${e.tag} ${s.narration}`:s.narration,o=this.splitTextToChunks(r,300),n=[];for(let l=0;l<o.length;l++){let y={text:o[l],reference_id:t,format:"mp3",mp3_bitrate:128,prosody:{speed:e.speed,volume:0},chunk_length:200,normalize:!0,latency:"normal"};try{let h=(await(0,ce.requestUrl)({url:Ue,method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json",model:"s1"},body:JSON.stringify(y)})).arrayBuffer;if(!h||h.byteLength<500)throw new Error(`Fish Audio \u7B2C ${l+1} \u6BB5\u672A\u8FD4\u56DE\u6709\u6548\u97F3\u9891`);n.push(h)}catch(f){throw(p=f.message)!=null&&p.includes("Fish Audio")||(m=f.message)!=null&&m.includes("API Key")?f:new Error(`Fish Audio TTS \u5408\u6210\u5931\u8D25 (\u6BB5 ${l+1}/${o.length}): ${f.message}`)}}let i=n.reduce((l,u)=>l+u.byteLength,0),c=new Uint8Array(i),a=0;for(let l of n)c.set(new Uint8Array(l),a),a+=l.byteLength;let d=c.buffer,g=d.byteLength/(128e3/8);return{sceneId:s.id,audioBuffer:d,audioPath:"",duration:g,sampleRate:44100}}splitTextToChunks(s,t){let e=s.split(/(?<=[。！？.!?])/g).filter(i=>i.trim()),r=[],o="";for(let i of e)o.length+i.length>t&&o.length>0&&(r.push(o.trim()),o=""),o+=i;o.trim()&&r.push(o.trim());let n=[];for(let i of r)if(i.length<=t)n.push(i);else for(let c=0;c<i.length;c+=t)n.push(i.substring(c,c+t));return n}async cloneVoice(s,t){var a;if(!this.apiKey)throw new Error("Fish Audio API Key \u672A\u914D\u7F6E");let e="----VideoForgeFish"+Date.now(),r=new TextEncoder,o=[];o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="visibility"\r
\r
private\r
`)),o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="type"\r
\r
tts\r
`)),o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="title"\r
\r
${t}\r
`)),o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="description"\r
\r
Video Forge \u514B\u9686\u8BED\u97F3: ${t}\r
`)),o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="train_mode"\r
\r
fast\r
`)),o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="enhance_audio_quality"\r
\r
true\r
`)),o.push(r.encode(`--${e}\r
Content-Disposition: form-data; name="voices"; filename="${t}.mp3"\r
Content-Type: audio/mpeg\r
\r
`)),o.push(new Uint8Array(s)),o.push(r.encode(`\r
`)),o.push(r.encode(`--${e}--\r
`));let n=o.reduce((d,g)=>d+g.byteLength,0),i=new Uint8Array(n),c=0;for(let d of o)i.set(d,c),c+=d.byteLength;try{let g=(await(0,ce.requestUrl)({url:Je,method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":`multipart/form-data; boundary=${e}`},body:i.buffer})).json;if(!g._id)throw new Error("\u8BED\u97F3\u514B\u9686\u5931\u8D25: \u672A\u8FD4\u56DE\u6A21\u578B ID");return g._id}catch(d){throw(a=d.message)!=null&&a.includes("\u514B\u9686")?d:new Error(`Fish Audio \u8BED\u97F3\u514B\u9686\u5931\u8D25: ${d.message}`)}}async listVoices(){if(!this.apiKey)return[];try{return((await(0,ce.requestUrl)({url:"https://api.fish.audio/model?page_size=50&page_number=1",method:"GET",headers:{Authorization:`Bearer ${this.apiKey}`}})).json.items||[]).map(r=>({voice_id:r._id,name:r.title||r._id}))}catch(s){return[]}}};var pe=require("obsidian"),qe="https://api.minimax.chat/v1/t2a_v2",Ie={neutral:{speed:1},excited:{speed:1.1},serious:{speed:.9},humorous:{speed:1},dramatic:{speed:.85},calm:{speed:.9},inspiring:{speed:1.05},mysterious:{speed:.85}},ee=class{constructor(s,t){this.apiKey=s,this.groupId=t}async synthesize(s,t){var g,p,m,l;if(!this.apiKey)throw new Error("MiniMax API Key \u672A\u914D\u7F6E");if(!this.groupId)throw new Error("MiniMax Group ID \u672A\u914D\u7F6E");let e=Ie[s.emotion]||Ie.neutral,r=this.splitTextToChunks(s.narration,300),o=[];for(let u=0;u<r.length;u++){let f={model:"speech-02-hd",text:r[u],stream:!1,voice_setting:{voice_id:t||"male-qn-qingse",speed:e.speed,vol:1,pitch:0},audio_setting:{sample_rate:32e3,bitrate:128e3,format:"mp3"}};try{let x=(await(0,pe.requestUrl)({url:`${qe}?GroupId=${this.groupId}`,method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify(f)})).json;if(((g=x.base_resp)==null?void 0:g.status_code)!==0)throw new Error(`MiniMax API \u9519\u8BEF: ${((p=x.base_resp)==null?void 0:p.status_msg)||"\u672A\u77E5\u9519\u8BEF"}`);if(!((m=x.data)!=null&&m.audio))throw new Error("MiniMax \u672A\u8FD4\u56DE\u97F3\u9891\u6570\u636E");let b=atob(x.data.audio),v=new Uint8Array(b.length);for(let C=0;C<b.length;C++)v[C]=b.charCodeAt(C);o.push(v.buffer)}catch(h){throw(l=h.message)!=null&&l.includes("MiniMax")?h:new Error(`MiniMax TTS \u5408\u6210\u5931\u8D25 (\u6BB5 ${u+1}/${r.length}): ${h.message}`)}}let n=o.reduce((u,y)=>u+y.byteLength,0),i=new Uint8Array(n),c=0;for(let u of o)i.set(new Uint8Array(u),c),c+=u.byteLength;let a=i.buffer,d=a.byteLength/(128e3/8);return{sceneId:s.id,audioBuffer:a,audioPath:"",duration:d,sampleRate:32e3}}splitTextToChunks(s,t){let e=s.split(/(?<=[。！？.!?])/g).filter(i=>i.trim()),r=[],o="";for(let i of e)o.length+i.length>t&&o.length>0&&(r.push(o.trim()),o=""),o+=i;o.trim()&&r.push(o.trim());let n=[];for(let i of r)if(i.length<=t)n.push(i);else for(let c=0;c<i.length;c+=t)n.push(i.substring(c,c+t));return n}async cloneVoice(s,t,e){var l,u,y,f,h,x;if(!this.apiKey)throw new Error("MiniMax API Key \u672A\u914D\u7F6E");if(!this.groupId)throw new Error("MiniMax Group ID \u672A\u914D\u7F6E");let r=((l=(e||"audio.mp3").split(".").pop())==null?void 0:l.toLowerCase())||"mp3",n={mp3:"audio/mpeg",wav:"audio/wav",m4a:"audio/mp4",ogg:"audio/ogg",flac:"audio/flac"}[r]||"audio/mpeg",i=`${t}.${r}`,c="----VideoForgeMiniMax"+Date.now(),a=new TextEncoder,d=[];d.push(a.encode(`--${c}\r
Content-Disposition: form-data; name="purpose"\r
\r
voice_clone\r
`)),d.push(a.encode(`--${c}\r
Content-Disposition: form-data; name="file"; filename="${i}"\r
Content-Type: ${n}\r
\r
`)),d.push(new Uint8Array(s)),d.push(a.encode(`\r
`)),d.push(a.encode(`--${c}--\r
`));let g=d.reduce((b,v)=>b+v.byteLength,0),p=new Uint8Array(g),m=0;for(let b of d)p.set(b,m),m+=b.byteLength;try{let v=(await(0,pe.requestUrl)({url:`https://api.minimax.chat/v1/files/upload?GroupId=${this.groupId}`,method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":`multipart/form-data; boundary=${c}`},body:p.buffer})).json;if(!((u=v.file)!=null&&u.file_id))throw console.error("[VideoForge] \u6587\u4EF6\u4E0A\u4F20\u54CD\u5E94:",JSON.stringify(v)),new Error(`\u8BED\u97F3\u514B\u9686\u5931\u8D25: \u672A\u8FD4\u56DE file_id (${((y=v.base_resp)==null?void 0:y.status_msg)||JSON.stringify(v).slice(0,100)})`);let F=(await(0,pe.requestUrl)({url:`https://api.minimax.chat/v1/voice_clone?GroupId=${this.groupId}`,method:"POST",headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({file_id:v.file.file_id,voice_id:`clone_${Date.now()}`})})).json;if(((f=F.base_resp)==null?void 0:f.status_code)!==0)throw new Error(`\u97F3\u8272\u514B\u9686\u5931\u8D25: ${(h=F.base_resp)==null?void 0:h.status_msg}`);return F.voice_id||`clone_${Date.now()}`}catch(b){throw(x=b.message)!=null&&x.includes("\u514B\u9686")?b:new Error(`MiniMax \u8BED\u97F3\u514B\u9686\u5931\u8D25: ${b.message}`)}}};var ge=require("obsidian"),Te="https://queue.fal.run/fal-ai/whisper",ue=class{constructor(s){this.apiKey=s}async getTimestamps(s,t,e="zh"){var p;if(!this.apiKey)throw new Error("fal.ai API Key \u672A\u914D\u7F6E");let r=this.audioToDataUri(s),o=await(0,ge.requestUrl)({url:Te,method:"POST",headers:{Authorization:`Key ${this.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({audio_url:r,task:"transcribe",language:e,chunk_level:"word"})}),{request_id:n,status_url:i}=o.json,c=await this.pollResult(n),a=c.chunks||[],d=this.chunksToSegments(a),g=d.length>0?d[d.length-1].end:0;return{sceneId:t,segments:d,language:((p=c.inferred_languages)==null?void 0:p[0])||e,duration:g,rawChunks:a}}audioToDataUri(s){let t=new Uint8Array(s),e="";for(let r=0;r<t.byteLength;r++)e+=String.fromCharCode(t[r]);return`data:audio/mpeg;base64,${btoa(e)}`}async pollResult(s){let t=`${Te}/requests/${s}`,e=`${Te}/requests/${s}/status`,r=60,o=2e3;for(let n=0;n<r;n++){await this.delay(o);let i=await(0,ge.requestUrl)({url:e,method:"GET",headers:{Authorization:`Key ${this.apiKey}`}}),{status:c}=i.json;if(c==="COMPLETED")return(await(0,ge.requestUrl)({url:t,method:"GET",headers:{Authorization:`Key ${this.apiKey}`}})).json;if(c!=="IN_QUEUE"&&c!=="IN_PROGRESS")throw new Error(`fal.ai Whisper \u4EFB\u52A1\u5931\u8D25: ${c}`)}throw new Error("fal.ai Whisper \u8D85\u65F6")}chunksToSegments(s){let t=[],r="",o=0,n=0,i=()=>{let c=r.trim();c&&t.push({id:t.length,start:o,end:n,text:c,confidence:.9}),r=""};for(let c of s){r===""&&(o=c.timestamp[0]),r+=c.text,n=c.timestamp[1];let a=/[。！？!?；;]$/.test(c.text),d=/[，,、：:]$/.test(c.text),g=r.trim().length;(a||d&&g>=8||g>=20)&&i()}return i(),t}delay(s){return new Promise(t=>setTimeout(t,s))}};var De=require("obsidian"),me=class{constructor(s="http://localhost:5111"){this.serverUrl=s.replace(/\/+$/,"")}async getTimestamps(s,t,e="zh"){var r,o;try{let i=(await(0,De.requestUrl)({url:`${this.serverUrl}/transcribe?language=${encodeURIComponent(e)}`,method:"POST",headers:{"Content-Type":"audio/mpeg"},body:s})).json;if(i.words&&i.words.length>0)return{sceneId:t,segments:this.wordsToSegments(i.words),language:i.language||e,duration:i.duration||0,rawChunks:i.words.map(a=>({text:a.word,timestamp:[a.start,a.end]}))};let c=(i.segments||[]).map((a,d)=>{var g;return{id:d,start:a.start,end:a.end,text:((g=a.text)==null?void 0:g.trim())||"",confidence:a.avg_logprob?Math.exp(a.avg_logprob):.9}});return{sceneId:t,segments:c,language:i.language||e,duration:i.duration||0}}catch(n){throw(r=n.message)!=null&&r.includes("ECONNREFUSED")||(o=n.message)!=null&&o.includes("net::ERR")?new Error("\u672C\u5730 Whisper \u670D\u52A1\u672A\u542F\u52A8\u3002\u8BF7\u8FD0\u884C: python VideoForge/whisper-server.py"):new Error(`\u672C\u5730 Whisper \u8F6C\u5F55\u5931\u8D25 (${t}): ${n.message}`)}}wordsToSegments(s){let t=[],r="",o=0,n=0,i=()=>{let c=r.trim();c&&t.push({id:t.length,start:o,end:n,text:c,confidence:.9}),r=""};for(let c of s){r===""&&(o=c.start),r+=c.word,n=c.end;let a=/[。！？!?；;]$/.test(c.word),d=/[，,、：:]$/.test(c.word),g=r.trim().length;(a||d&&g>=8||g>=20)&&i()}return i(),t}};var ie=class{constructor(s,t){this.app=s,this.settings=t}async composeScenes(s){var c;let t=this.settings.fps,e=[],r=(c=this.settings.coverDurationSec)!=null?c:.1,o=Math.max(1,Math.ceil(r*t)),n=await this.findLatestCover(),i=n?o:0;for(let a=0;a<s.scenes.length;a++){let d=s.scenes[a],g=s.ttsResults.find(u=>u.sceneId===d.id),p=s.whisperResults.find(u=>u.sceneId===d.id);if(!g||!p)continue;let m=g.duration||d.duration,l=Math.ceil(m*t);e.push({scene:d,tts:g,whisper:p,startFrame:i,endFrame:i+l,durationFrames:l}),i+=l}return{id:s.id,title:s.title,scenes:e,style:this.settings.defaultStyle,totalDurationFrames:i,fps:t,width:this.settings.videoWidth,height:this.settings.videoHeight,coverImagePath:n||void 0,coverDurationFrames:n?o:void 0}}async findLatestCover(){let s=this.settings.coverOutputDir||"VideoForge/covers",t=this.app.vault.getFiles().filter(e=>e.path.startsWith(s)&&e.extension==="png").sort((e,r)=>r.stat.mtime-e.stat.mtime);return t.length>0?t[0].path:null}async generateRemotionProject(s){let t=this.settings.remotionProjectPath||"VideoForge/remotion-project",e=this.generateRootComponent(s);await this.writeFile(`${t}/src/Root.tsx`,e);let r=this.generateVideoComposition(s);await this.writeFile(`${t}/src/VideoComposition.tsx`,r);let o=this.generateSceneComponent(s.style);await this.writeFile(`${t}/src/SceneComponent.tsx`,o);let n=this.generateSubtitleRenderer(s.style);await this.writeFile(`${t}/src/SubtitleRenderer.tsx`,n);let i=this.generateTransitions();await this.writeFile(`${t}/src/transitions.tsx`,i);let c=JSON.stringify(s,null,2);await this.writeFile(`${t}/src/data/composition.json`,c);let a=this.generatePackageJson(s);return await this.writeFile(`${t}/package.json`,a),t}generateRootComponent(s){return`import { Composition } from "remotion";
import { VideoComposition } from "./VideoComposition";
import compositionData from "./data/composition.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="${s.id}"
        component={VideoComposition}
        durationInFrames={${s.totalDurationFrames}}
        fps={${s.fps}}
        width={${s.width}}
        height={${s.height}}
        defaultProps={{
          data: compositionData,
        }}
      />
    </>
  );
};
`}generateVideoComposition(s){return`import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { SceneComponent } from "./SceneComponent";
import { SubtitleRenderer } from "./SubtitleRenderer";
import { TransitionOverlay } from "./transitions";

interface CompositionData {
  coverImagePath?: string;
  coverDurationFrames?: number;
  scenes: Array<{
    scene: {
      id: string;
      narration: string;
      visualPrompt: string;
      emotion: string;
      bgImageKeywords: string[];
    };
    tts: {
      audioPath: string;
      duration: number;
    };
    whisper: {
      segments: Array<{
        start: number;
        end: number;
        text: string;
      }>;
    };
    startFrame: number;
    endFrame: number;
    durationFrames: number;
  }>;
  style: {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    bgColor: string;
    accentColor: string;
    subtitleStyle: string;
    transition: string;
    transitionDuration: number;
  };
}

export const VideoComposition: React.FC<{ data: CompositionData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

${s.scenes.map((e,r)=>`  // Scene ${r}: ${s.scenes[r].scene.narration.substring(0,30)}...`).join(`
`)}

  return (
    <AbsoluteFill style={{ backgroundColor: data.style.bgColor }}>
      {/* \u5C01\u9762\uFF08\u89C6\u9891\u7B2C\u4E00\u5E27\uFF09 */}
      {data.coverImagePath && data.coverDurationFrames && (
        <Sequence from={0} durationInFrames={data.coverDurationFrames} name="Cover">
          <AbsoluteFill>
            <Img
              src={staticFile("images/cover.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </Sequence>
      )}
      {data.scenes.map((composedScene, index) => (
        <Sequence
          key={composedScene.scene.id}
          from={composedScene.startFrame}
          durationInFrames={composedScene.durationFrames}
          name={\`Scene \${index + 1}: \${composedScene.scene.id}\`}
        >
          {/* \u80CC\u666F\u573A\u666F */}
          <SceneComponent
            scene={composedScene.scene}
            style={data.style}
            durationFrames={composedScene.durationFrames}
          />

          {/* \u97F3\u9891 */}
          <Audio
            src={staticFile(\`audio/\${composedScene.scene.id}.mp3\`)}
            volume={1}
          />

          {/* \u5B57\u5E55 */}
          <SubtitleRenderer
            segments={composedScene.whisper.segments}
            style={data.style}
            fps={fps}
          />

          {/* \u8F6C\u573A (\u5728\u573A\u666F\u672B\u5C3E) */}
          {index < data.scenes.length - 1 && (
            <TransitionOverlay
              type={data.style.transition as any}
              durationFrames={Math.round(data.style.transitionDuration * fps)}
              totalFrames={composedScene.durationFrames}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
`}generateSceneComponent(s){return`import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

interface SceneProps {
  scene: {
    id: string;
    visualPrompt: string;
    emotion: string;
    bgImageKeywords: string[];
  };
  style: {
    bgColor: string;
    accentColor: string;
    fontFamily: string;
  };
  durationFrames: number;
}

export const SceneComponent: React.FC<SceneProps> = ({
  scene,
  style,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns \u7F13\u52A8\u6548\u679C
  const scale = interpolate(frame, [0, durationFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(frame, [0, durationFrames], [0, -15], {
    extrapolateRight: "clamp",
  });

  // \u6E10\u5165\u6548\u679C
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // \u60C5\u611F\u8272\u8C03\u6620\u5C04
  const emotionOverlay: Record<string, string> = {
    neutral: "rgba(0,0,0,0.3)",
    excited: "rgba(255,100,0,0.15)",
    serious: "rgba(0,0,50,0.4)",
    humorous: "rgba(255,200,0,0.1)",
    dramatic: "rgba(80,0,0,0.35)",
    calm: "rgba(0,50,100,0.2)",
    inspiring: "rgba(255,150,0,0.15)",
    mysterious: "rgba(30,0,60,0.4)",
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* \u80CC\u666F\u56FE\u5C42 - \u5C1D\u8BD5\u52A0\u8F7D\u573A\u666F\u56FE\u7247 */}
      <AbsoluteFill
        style={{
          transform: \`scale(\${scale}) translateX(\${translateX}px)\`,
          backgroundColor: style.bgColor,
        }}
      >
        <Img
          src={staticFile(\`images/\${scene.id}.jpg\`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            // \u56FE\u7247\u4E0D\u5B58\u5728\u65F6\u4F7F\u7528\u6E10\u53D8\u80CC\u666F
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </AbsoluteFill>

      {/* \u60C5\u611F\u8272\u8C03\u53E0\u52A0 */}
      <AbsoluteFill
        style={{
          background: emotionOverlay[scene.emotion] || emotionOverlay.neutral,
        }}
      />

      {/* \u5E95\u90E8\u6E10\u53D8 (\u4E3A\u5B57\u5E55\u7559\u51FA\u7A7A\u95F4) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(transparent 60%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* \u88C5\u9970\u6027\u51E0\u4F55\u5143\u7D20 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 60,
          height: 3,
          backgroundColor: style.accentColor,
          opacity: 0.8,
          transform: \`scaleX(\${interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          })})\`,
          transformOrigin: "left",
        }}
      />
    </AbsoluteFill>
  );
};
`}generateSubtitleRenderer(s){return`import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface Segment {
  start: number;
  end: number;
  text: string;
}

interface SubtitleProps {
  segments: Segment[];
  style: {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    accentColor: string;
    subtitleStyle: string;
  };
  fps: number;
}

export const SubtitleRenderer: React.FC<SubtitleProps> = ({
  segments,
  style,
  fps,
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  // \u627E\u5230\u5F53\u524D\u65F6\u95F4\u7684\u5B57\u5E55\u6BB5
  const currentSegment = segments.find(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  );

  if (!currentSegment) return null;

  const segStartFrame = Math.floor(currentSegment.start * fps);
  const segEndFrame = Math.floor(currentSegment.end * fps);
  const segFrame = frame - segStartFrame;
  const segDuration = segEndFrame - segStartFrame;

  // \u8FDB\u5165\u52A8\u753B
  const enterProgress = interpolate(segFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // \u9000\u51FA\u52A8\u753B
  const exitProgress = interpolate(
    segFrame,
    [segDuration - 8, segDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(enterProgress, exitProgress);

  // \u6839\u636E\u5B57\u5E55\u98CE\u683C\u6E32\u67D3
  switch (style.subtitleStyle) {
    case "bottom-bar":
      return (
        <BottomBarSubtitle
          text={currentSegment.text}
          style={style}
          opacity={opacity}
          enterProgress={enterProgress}
        />
      );
    case "center-pop":
      return (
        <CenterPopSubtitle
          text={currentSegment.text}
          style={style}
          opacity={opacity}
          enterProgress={enterProgress}
          fps={fps}
          frame={segFrame}
        />
      );
    case "typewriter":
      return (
        <TypewriterSubtitle
          text={currentSegment.text}
          style={style}
          progress={(currentTime - currentSegment.start) / (currentSegment.end - currentSegment.start)}
        />
      );
    case "karaoke":
      return (
        <KaraokeSubtitle
          text={currentSegment.text}
          style={style}
          progress={(currentTime - currentSegment.start) / (currentSegment.end - currentSegment.start)}
        />
      );
    default:
      return (
        <BottomBarSubtitle
          text={currentSegment.text}
          style={style}
          opacity={opacity}
          enterProgress={enterProgress}
        />
      );
  }
};

// ---- \u5B57\u5E55\u6837\u5F0F\u7EC4\u4EF6 ----

const BottomBarSubtitle: React.FC<{
  text: string;
  style: any;
  opacity: number;
  enterProgress: number;
}> = ({ text, style, opacity, enterProgress }) => (
  <div
    style={{
      position: "absolute",
      bottom: 80,
      left: "50%",
      transform: \`translateX(-50%) translateY(\${(1 - enterProgress) * 20}px)\`,
      opacity,
      padding: "12px 32px",
      background: "rgba(0,0,0,0.75)",
      borderRadius: 8,
      backdropFilter: "blur(10px)",
      borderLeft: \`3px solid \${style.accentColor}\`,
    }}
  >
    <span
      style={{
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        color: style.fontColor,
        letterSpacing: "0.05em",
        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
        lineHeight: 1.5,
      }}
    >
      {text}
    </span>
  </div>
);

const CenterPopSubtitle: React.FC<{
  text: string;
  style: any;
  opacity: number;
  enterProgress: number;
  fps: number;
  frame: number;
}> = ({ text, style, opacity, enterProgress, fps, frame }) => {
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          transform: \`scale(\${scale})\`,
          padding: "20px 48px",
          background: "rgba(0,0,0,0.8)",
          borderRadius: 12,
          border: \`2px solid \${style.accentColor}40\`,
        }}
      >
        <span
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize * 1.2,
            color: style.fontColor,
            fontWeight: 700,
            textShadow: \`0 0 20px \${style.accentColor}60\`,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const TypewriterSubtitle: React.FC<{
  text: string;
  style: any;
  progress: number;
}> = ({ text, style, progress }) => {
  const visibleChars = Math.floor(progress * text.length);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "12px 32px",
        background: "rgba(0,0,0,0.75)",
        borderRadius: 8,
      }}
    >
      <span
        style={{
          fontFamily: \`"\${style.fontFamily}", monospace\`,
          fontSize: style.fontSize,
          color: style.fontColor,
        }}
      >
        {text.slice(0, visibleChars)}
        <span style={{ opacity: 0.5, borderRight: \`2px solid \${style.accentColor}\`, paddingRight: 2 }} />
      </span>
    </div>
  );
};

const KaraokeSubtitle: React.FC<{
  text: string;
  style: any;
  progress: number;
}> = ({ text, style, progress }) => (
  <div
    style={{
      position: "absolute",
      bottom: 80,
      left: "50%",
      transform: "translateX(-50%)",
      padding: "12px 32px",
      background: "rgba(0,0,0,0.75)",
      borderRadius: 8,
    }}
  >
    {text.split("").map((char, i) => {
      const charProgress = i / text.length;
      const isHighlighted = charProgress < progress;
      return (
        <span
          key={i}
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            color: isHighlighted ? style.accentColor : style.fontColor,
            transition: "color 0.1s",
            fontWeight: isHighlighted ? 700 : 400,
            textShadow: isHighlighted
              ? \`0 0 12px \${style.accentColor}80\`
              : "none",
          }}
        >
          {char}
        </span>
      );
    })}
  </div>
);
`}generateTransitions(){return`import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";

type TransitionType = "crossfade" | "slide" | "zoom" | "glitch" | "none";

interface TransitionProps {
  type: TransitionType;
  durationFrames: number;
  totalFrames: number;
}

export const TransitionOverlay: React.FC<TransitionProps> = ({
  type,
  durationFrames,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const transitionStart = totalFrames - durationFrames;

  if (frame < transitionStart || type === "none") return null;

  const progress = interpolate(
    frame,
    [transitionStart, totalFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  switch (type) {
    case "crossfade":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "black",
            opacity: progress,
          }}
        />
      );

    case "slide":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "black",
            transform: \`translateX(\${(1 - progress) * 100}%)\`,
          }}
        />
      );

    case "zoom":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "black",
            opacity: progress,
            transform: \`scale(\${1 + progress * 0.5})\`,
          }}
        />
      );

    case "glitch":
      const glitchOffset = Math.sin(frame * 0.5) * 10 * progress;
      return (
        <>
          <AbsoluteFill
            style={{
              backgroundColor: "cyan",
              opacity: progress * 0.3,
              transform: \`translateX(\${glitchOffset}px)\`,
              mixBlendMode: "screen",
            }}
          />
          <AbsoluteFill
            style={{
              backgroundColor: "red",
              opacity: progress * 0.3,
              transform: \`translateX(\${-glitchOffset}px)\`,
              mixBlendMode: "screen",
            }}
          />
        </>
      );

    default:
      return null;
  }
};
`}generatePackageJson(s){return JSON.stringify({name:`video-forge-${s.id}`,version:"1.0.0",private:!0,scripts:{start:"remotion studio",build:`remotion render src/Root.tsx ${s.id} out/video.mp4`,preview:"remotion preview src/Root.tsx"},dependencies:{"@remotion/bundler":"^4.0.0","@remotion/cli":"^4.0.0","@remotion/renderer":"^4.0.0",react:"^18.0.0","react-dom":"^18.0.0",remotion:"^4.0.0"},devDependencies:{"@types/react":"^18.0.0",typescript:"^5.0.0"}},null,2)}async writeFile(s,t){let e=this.app.vault.adapter,r=s.substring(0,s.lastIndexOf("/"));if(r)try{await e.mkdir(r)}catch(o){}await e.write(s,t)}};var Xe={"fish-audio":"Fish Audio",minimax:"MiniMax"},he=class{constructor(s,t){this.listeners=[];this.app=s,this.settings=t,this.gemini=new ne(t.geminiApiKey,t.geminiModel,t.geminiBaseUrl,t.claudeApiKey,t.claudeBaseUrl),this.tts=this.createTTSEngine(t),this.whisper=this.createWhisperEngine(t),this.remotion=new ie(s,t)}createTTSEngine(s){switch(s.ttsEngine){case"minimax":return new ee(s.minimaxApiKey,s.minimaxGroupId);case"fish-audio":default:return new de(s.fishAudioApiKey)}}createWhisperEngine(s){return s.whisperEngine==="fal"?new ue(s.falApiKey):new me(s.localWhisperUrl||"http://localhost:5111")}getTTSEngineName(){return Xe[this.settings.ttsEngine]||this.settings.ttsEngine}updateSettings(s){this.settings=s,this.gemini=new ne(s.geminiApiKey,s.geminiModel,s.geminiBaseUrl,s.claudeApiKey,s.claudeBaseUrl),this.tts=this.createTTSEngine(s),this.whisper=this.createWhisperEngine(s),this.remotion=new ie(this.app,s)}onStateChange(s){return this.listeners.push(s),()=>{this.listeners=this.listeners.filter(t=>t!==s)}}emit(s){this.listeners.forEach(t=>t(s))}async run(s,t){var r;let e={id:`vf-${Date.now()}`,title:s.title,createdAt:Date.now(),updatedAt:Date.now(),script:s,scenes:[],ttsResults:[],whisperResults:[],composedScenes:[],state:{stage:"idle",progress:0,currentScene:0,totalScenes:0,message:"\u51C6\u5907\u4E2D..."}};try{if(!this.settings.remotionProjectPath){let S=this.app.vault.adapter,T=["VideoForge/remotion-project","remotion-project","remotion","VideoForge"];for(let A of T)try{if((await S.read(`${A}/package.json`)).includes("remotion")){this.settings.remotionProjectPath=A,new I.Notice(`\u{1F50D} \u81EA\u52A8\u68C0\u6D4B\u5230 Remotion \u9879\u76EE: ${A}`);break}}catch(N){}}this.emit({stage:"splitting",progress:5,currentScene:0,totalScenes:0,message:"\u{1F9E0} Gemini \u6B63\u5728\u5206\u6790\u811A\u672C\uFF0C\u62C6\u89E3\u573A\u666F...",startedAt:Date.now()}),e.scenes=await this.gemini.splitScenes(s.content),e.state.totalScenes=e.scenes.length,this.emit({stage:"splitting",progress:15,currentScene:0,totalScenes:e.scenes.length,message:`\u2705 \u62C6\u89E3\u5B8C\u6210\uFF0C\u5171 ${e.scenes.length} \u4E2A\u573A\u666F`}),new I.Notice(`\u{1F3AC} Video Forge: \u62C6\u89E3\u4E3A ${e.scenes.length} \u4E2A\u573A\u666F`),await this.saveProjectData(e);let o=this.getTTSEngineName();this.emit({stage:"tts",progress:20,currentScene:0,totalScenes:e.scenes.length,message:`\u{1F399}\uFE0F ${o} \u6574\u6BB5\u8BED\u97F3\u5408\u6210\u4E2D...`});let n=s.content.replace(/^---[\s\S]*?---\s*/m,"").replace(/!\[\[[^\]]+\]\]/g,"").replace(/^#{1,6}\s+.*$/gm,"").replace(/\n{3,}/g,`

`).trim(),i={id:"merged-all",index:0,narration:n,visualPrompt:"",duration:0,emotion:"neutral",notes:"",bgImageKeywords:[]};this.emit({stage:"tts",progress:30,currentScene:1,totalScenes:1,message:`\u{1F399}\uFE0F ${o} \u6574\u6BB5\u5408\u6210\u4E2D\uFF08${n.length} \u5B57\uFF09...`});let c=await this.tts.synthesize(i,t),a=`VideoForge/output/${e.id}/public/narration.mp3`;await this.saveAudioFile(a,c.audioBuffer),c.audioPath=a,e.ttsResults.push(c),new I.Notice(`\u{1F399}\uFE0F Video Forge: \u6574\u6BB5\u8BED\u97F3\u5408\u6210\u5B8C\u6210\uFF08${o}\uFF0C${n.length} \u5B57\uFF09`);let d=this.settings.whisperEngine==="local"?"\u672C\u5730Whisper":"fal.ai";this.emit({stage:"timestamping",progress:55,currentScene:1,totalScenes:1,message:`\u23F1\uFE0F ${d} \u6B63\u5728\u4E3A\u6574\u6BB5\u97F3\u9891\u751F\u6210\u5B57\u5E55\u65F6\u95F4\u6233...`});let g=await this.whisper.getTimestamps(c.audioBuffer,"merged-all");g.duration>0&&(c.duration=g.duration),e.whisperResults.push(g),new I.Notice("\u23F1\uFE0F Video Forge: \u5B57\u5E55\u65F6\u95F4\u6233\u751F\u6210\u5B8C\u6210");let p,m=g.rawChunks||[];m.length>0?p=this.alignScriptWithChunks(n,m):p=g.segments;let l=this.segmentsToSRT(p),u=`VideoForge/output/${e.id}/public/subtitles.srt`;await this.saveSRTFile(u,l),new I.Notice(`\u{1F4DD} Video Forge: SRT \u5B57\u5E55\u6587\u4EF6\u5DF2\u4FDD\u5B58\uFF08${p.length} \u6761\uFF09`);let y=/!\[\[([^\]]+\.(png|jpg|jpeg|gif|webp))\]\]/gi,f=[],h;for(;(h=y.exec(s.content))!==null;)f.push({fileName:h[1],position:h.index});let x=`${this.settings.remotionProjectPath||"VideoForge/remotion-project"}/public`,b=[];for(let S of f)try{let T=S.fileName,A=this.app.metadataCache.getFirstLinkpathDest(S.fileName,s.sourcePath||"");A&&(T=A.path);let N=await this.app.vault.adapter.readBinary(T),R=(S.fileName.split("/").pop()||S.fileName).replace(/\s+/g,"_");await this.app.vault.adapter.writeBinary(`${x}/${R}`,N),b.push({fileName:R,position:S.position}),new I.Notice(`\u{1F5BC}\uFE0F \u56FE\u7247\u5DF2\u590D\u5236: ${R}`)}catch(T){new I.Notice(`\u26A0\uFE0F \u56FE\u7247\u672A\u627E\u5230\uFF0C\u8DF3\u8FC7: ${S.fileName}`)}let v=this.parseSRT(l),C=b.map(S=>{let A=s.content.substring(0,S.position).replace(/!\[\[[^\]]+\]\]/g,"").replace(/^---[\s\S]*?---\s*/m,"").trim().split(`
`).map(M=>M.trim()).filter(M=>M.length>0),V=(A.length>0?A[A.length-1]:"").replace(/[，。！？、；：,.\!\?\;\:…""''「」【】《》\(\)（）\[\]\*#_~`]/g,"").replace(/\s+/g,"");if(!V){let M=S.position/s.content.length,_=parseFloat((M*c.duration).toFixed(3)),j=parseFloat(Math.min(_+8,c.duration).toFixed(3));return{fileName:S.fileName,start:_,end:j}}let R=null,z=-1;for(let M of v){let _=M.text.replace(/[，。！？、；：,.\!\?\;\:…""''「」【】《》\(\)（）\[\]\*#_~`]/g,"").replace(/\s+/g,"");if(_.length<2)continue;let j=this.calculateSimilarity(V,_);j>z&&(z=j,R=M)}if(z<.5)for(let M=0;M<v.length-1;M++){let _=(v[M].text+v[M+1].text).replace(/[，。！？、；：,.\!\?\;\:…""''「」【】《》\(\)（）\[\]\*#_~`]/g,"").replace(/\s+/g,""),j=this.calculateSimilarity(V,_);j>z&&(z=j,R={start:v[M].start,end:v[M+1].end})}if(!R||z<.2){let M=S.position/s.content.length,_=parseFloat((M*c.duration).toFixed(3)),j=parseFloat(Math.min(_+8,c.duration).toFixed(3));return{fileName:S.fileName,start:_,end:j}}let J=parseFloat(R.start.toFixed(3)),oe=parseFloat(Math.min(J+8,c.duration).toFixed(3));return{fileName:S.fileName,start:J,end:oe}}),F=[],$=new Map;for(let S of C){let T=`${S.start}-${S.end}`;$.has(T)||$.set(T,[]),$.get(T).push(S)}for(let[,S]of $)if(S.length===1)F.push(S[0]);else{let A=(S[0].end-S[0].start)/S.length;S.forEach((N,V)=>{let R=parseFloat((S[0].start+V*A).toFixed(3)),z=parseFloat((R+A).toFixed(3));F.push({fileName:N.fileName,start:R,end:z})})}let P=/!\[\[([^\]]+\.(mp4|mov|webm))\]\]/gi,k=[],D;for(;(D=P.exec(s.content))!==null;)k.push({fileName:D[1],position:D.index});let W=[];for(let S of k)try{let T=S.fileName,A=this.app.metadataCache.getFirstLinkpathDest(S.fileName,s.sourcePath||"");A&&(T=A.path);let N=await this.app.vault.adapter.readBinary(T),R=(S.fileName.split("/").pop()||S.fileName).replace(/\s+/g,"_");await this.app.vault.adapter.writeBinary(`${x}/${R}`,N),W.push({fileName:R,position:S.position}),new I.Notice(`\u{1F3AC} \u89C6\u9891\u5DF2\u590D\u5236: ${R}`)}catch(T){new I.Notice(`\u26A0\uFE0F \u89C6\u9891\u672A\u627E\u5230\uFF0C\u8DF3\u8FC7: ${S.fileName}`)}let X=W.map(S=>{let T=s.content.substring(0,S.position).replace(/!\[\[[^\]]+\]\]/g,"").replace(/^---[\s\S]*?---\s*/m,"").replace(/\s+/g,""),A=null,N=-1;for(let J of v){let oe=J.text.replace(/\s+/g,"");if(oe.length<2)continue;let M=T.lastIndexOf(oe);M>=0&&M>N&&(N=M,A=J)}let V=A?A.start:0,R=parseFloat(V.toFixed(3)),z=parseFloat(Math.min(R+8,c.duration).toFixed(3));return{fileName:S.fileName,start:R,end:z}}),G=(r=this.settings.geminiModel)!=null&&r.toLowerCase().includes("claude")?"Claude":"Gemini";this.emit({stage:"timestamping",progress:65,currentScene:1,totalScenes:1,message:`\u{1F3A8} ${G} \u6B63\u5728\u63D0\u70BC\u5173\u952E\u8BCD\u751F\u6210 PPT slides...`});let K="narration.mp3",H=null;if(s.bgmFile){let S=this.app.vault.adapter,T=`${this.settings.remotionProjectPath||"VideoForge/remotion-project"}/public`,A=s.bgmFile.replace(/\s+/g,"_"),N=s.sourcePath.substring(0,s.sourcePath.lastIndexOf("/")),V=[`${T}/${s.bgmFile}`,`${N}/${s.bgmFile}`,s.bgmFile],R=!1;for(let z of V)try{let J=await S.readBinary(z);z!==`${T}/${A}`&&await S.writeBinary(`${T}/${A}`,J),H=A,new I.Notice(`\u{1F3B5} BGM \u5DF2\u52A0\u8F7D: ${s.bgmFile}`),R=!0;break}catch(J){}R||new I.Notice(`\u26A0\uFE0F \u6307\u5B9A\u7684 BGM \u6587\u4EF6\u672A\u627E\u5230: ${s.bgmFile}`)}else H=await this.matchBGM(e.scenes);let O,Y=null;try{let S=this.settings.coverOutputDir||"VideoForge/covers",T=this.app.vault.getFiles().filter(A=>A.path.startsWith(S)&&A.extension==="png").sort((A,N)=>N.stat.mtime-A.stat.mtime);if(T.length>0){let A=T[0],N=this.settings.remotionProjectPath||"VideoForge/remotion-project",V=await this.app.vault.readBinary(A);Y="cover.png",await this.app.vault.adapter.writeBinary(`${N}/public/${Y}`,V),new I.Notice(`\u{1F5BC}\uFE0F \u5C01\u9762\u5DF2\u52A0\u5165\u89C6\u9891: ${A.name}`)}}catch(S){console.warn("\u5C01\u9762\u67E5\u627E/\u590D\u5236\u5931\u8D25:",S.message)}try{let S=await this.gemini.generateSlides(l,n),T=S.slides,A=S.topTitle;T=this.sanitizeSlides(T,l),T=await this.checkAndRefineSlides(T,l),O=this.generateHelloWorldJSXFromSlides(T,K,l,F,H,s.title,X,A,Y),new I.Notice(`\u{1F3A8} Video Forge: ${G} \u751F\u6210\u4E86 ${T.length} \u5C4F slides`)}catch(S){new I.Notice(`\u26A0\uFE0F ${G} slides \u5931\u8D25\uFF0C\u56DE\u9000\u89C4\u5219\u5F15\u64CE: ${S.message}`),O=this.generateHelloWorldJSX(l,K,F,H,s.title,X,Y)}let{fixed:Me,fixes:te}=this.autoFixGeneratedJSX(O);O=Me;let Ee=`VideoForge/output/${e.id}/HelloWorld.jsx`;await this.saveSRTFile(Ee,O);let U=this.validateGeneratedJSX(O,K,H,s.title,s.content),Be=5;for(let S=1;S<=Be;S++){let T=U.length;if(T<=2)break;let{fixed:A,fixes:N}=this.autoFixGeneratedJSX(O);if(A===O||(O=A,await this.saveSRTFile(Ee,O),te.push(...N),U=this.validateGeneratedJSX(O,K,H,s.title,s.content),U.length>=T))break}let L=["\u2500\u2500 JSX \u81EA\u68C0\u62A5\u544A \u2500\u2500",`\u{1F3A8} \u5B57\u4F53: ${this.settings.defaultStyle.fontFamily} | \u80CC\u666F: ${this.settings.defaultStyle.bgColor} | BGM\u97F3\u91CF: ${this.settings.defaultStyle.bgmVolume}`,`\u{1F4D0} \u6A21\u5F0F: ${(this.settings.videoHeight||1080)>(this.settings.videoWidth||1920)?"\u7AD6\u5C4F":"\u6A2A\u5C4F"} | \u5B57\u5E55\u5B57\u53F7: ${this.settings.defaultStyle.subtitleFontSize||46}`,`\u{1F3A8} \u6587\u5B57\u8272: normal=${this.settings.defaultStyle.fontColor} accent=${this.settings.defaultStyle.accentColor} hero=${this.settings.defaultStyle.heroColor}`,`\u{1F5BC}\uFE0F \u56FE\u7247: ${F.length} \u5F20 | \u{1F3AC} \u89C6\u9891: ${X.length} \u4E2A`];te.length>0&&(L.push(`\u{1F527} \u81EA\u52A8\u4FEE\u590D ${te.length} \u9879:`),te.forEach(S=>L.push(`  ${S}`)));let se=U.filter(S=>S.startsWith("\u274C"));se.length>0&&(L.push(`\u274C \u4ECD\u6709 ${se.length} \u4E2A\u4E25\u91CD\u95EE\u9898\u672A\u4FEE\u590D:`),se.forEach(S=>L.push(`  ${S}`)));let we=U.filter(S=>!S.startsWith("\u274C"));we.length>0&&(L.push(`\u26A0\uFE0F ${we.length} \u4E2A\u8B66\u544A:`),we.forEach(S=>L.push(`  ${S}`))),U.length===0&&L.push("\u2705 \u81EA\u68C0\u901A\u8FC7\uFF0C\u6240\u6709\u53D8\u91CF\u548C\u56FA\u5B9A\u533A\u6B63\u5E38"),e._jsxLogs=L,this.emit({stage:"composing",progress:78,currentScene:0,totalScenes:0,message:te.length>0?`\u{1F527} \u81EA\u52A8\u4FEE\u590D ${te.length} \u9879${se.length>0?`\uFF0C\u4ECD\u6709 ${se.length} \u4E2A\u4E25\u91CD\u95EE\u9898`:"\uFF0C\u81EA\u68C0\u901A\u8FC7"}`:U.length>0?`\u26A0\uFE0F JSX \u81EA\u68C0\u53D1\u73B0 ${U.length} \u4E2A\u95EE\u9898`:"\u2705 JSX \u81EA\u68C0\u901A\u8FC7",logs:L});let Ne=e.ttsResults.reduce((S,T)=>S+T.duration,0),Pe=this.generateRootJSX(Ne),Oe=`VideoForge/output/${e.id}/Root.jsx`;await this.saveSRTFile(Oe,Pe),new I.Notice("\u{1F4DD} Video Forge: HelloWorld.jsx + Root.jsx \u5DF2\u751F\u6210"),this.emit({stage:"composing",progress:80,currentScene:0,totalScenes:e.scenes.length,message:"\u{1F527} \u5408\u6210\u89C6\u9891 Composition \u6570\u636E..."});let Fe=await this.remotion.composeScenes(e);e.composition=Fe,e.composedScenes=Fe.scenes,this.emit({stage:"rendering",progress:85,currentScene:0,totalScenes:e.scenes.length,message:"\u{1F4E6} \u751F\u6210 Remotion \u9879\u76EE\u6587\u4EF6..."});let Ve=await this.remotion.generateRemotionProject(Fe);e.outputPath=Ve;let Z=this.settings.remotionProjectPath||"VideoForge/remotion-project";await this.saveSRTFile(`${Z}/src/HelloWorld.jsx`,O),await this.saveSRTFile(`${Z}/src/Root.jsx`,Pe),await this.saveAudioFile(`${Z}/public/${K}`,c.audioBuffer),await this.saveSRTFile(`${Z}/public/subtitles.srt`,l);let ze=["Root.tsx","VideoComposition.tsx","SceneComponent.tsx","SubtitleRenderer.tsx","transitions.tsx"];for(let S of ze)try{await this.app.vault.adapter.remove(`${Z}/src/${S}`)}catch(T){}let _e=`import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root.jsx";

registerRoot(RemotionRoot);
`;await this.saveSRTFile(`${Z}/src/index.ts`,_e),new I.Notice("\u{1F3AC} Video Forge: HelloWorld.jsx + Root.jsx + \u97F3\u9891\u5DF2\u5199\u5165 Remotion \u9879\u76EE"),await this.saveProjectData(e),this._lastRenderInfo={title:s.title,projectId:e.id,remotionDir:Z};let Ce=e._jsxLogs||[];e.state={stage:"rendering",progress:95,currentScene:e.scenes.length,totalScenes:e.scenes.length,message:"\u{1F3AC} \u9879\u76EE\u5DF2\u751F\u6210\uFF0C\u6B63\u5728\u6E32\u67D3\u89C6\u9891\uFF08\u9884\u8BA1 1-3 \u5206\u949F\uFF0C\u8BF7\u7A0D\u5019\uFF09...",logs:Ce},this.emit(e.state);try{await this.renderToDisk();try{await this.app.vault.adapter.rmdir(`VideoForge/output/${e.id}`,!0)}catch(S){}e.state={stage:"complete",progress:100,currentScene:e.scenes.length,totalScenes:e.scenes.length,message:"\u2705 \u89C6\u9891\u5DF2\u751F\u6210\u5B8C\u6210\uFF01",completedAt:Date.now(),logs:Ce},this.emit(e.state)}catch(S){e.state={stage:"complete",progress:100,currentScene:e.scenes.length,totalScenes:e.scenes.length,message:`\u26A0\uFE0F \u9879\u76EE\u5DF2\u751F\u6210\uFF0C\u4F46\u89C6\u9891\u6E32\u67D3\u5931\u8D25\uFF1A${S.message}\u3002\u53EF\u70B9\u300C\u{1F3AC} \u6E32\u67D3\u89C6\u9891\u300D\u91CD\u8BD5`,completedAt:Date.now(),logs:Ce},this.emit(e.state)}return e}catch(o){let n={stage:"error",progress:e.state.progress,currentScene:e.state.currentScene,totalScenes:e.state.totalScenes,message:`\u274C \u9519\u8BEF: ${o.message}`,error:o.message};throw e.state=n,this.emit(n),new I.Notice(`\u274C Video Forge \u9519\u8BEF: ${o.message}`),o}}async renderToDisk(){let{exec:s}=require("child_process"),{mkdirSync:t}=require("fs"),e=process.platform==="win32",r=this.settings.remotionProjectPath||"VideoForge/remotion-project",o=this.app.vault.adapter.getBasePath()+"/"+r,n=e?o.replace(/\//g,"\\"):o,i="HelloWorld",c="video";try{let h=`${r}/src/Root.jsx`;console.log("[VideoForge] \u8BFB\u53D6 Root.jsx:",h);let b=(await this.app.vault.adapter.read(h)).match(/id="([^"]+)"/);b&&(i=b[1]),console.log("[VideoForge] composition ID:",i)}catch(h){console.error("[VideoForge] \u8BFB\u53D6 Root.jsx \u5931\u8D25:",h.message)}try{let x=(await this.app.vault.adapter.read(`${r}/src/HelloWorld.jsx`)).match(/const videoTitle = '([^']+)'/);x&&(c=x[1]),console.log("[VideoForge] videoTitle:",c)}catch(h){console.error("[VideoForge] \u8BFB\u53D6 HelloWorld.jsx \u5931\u8D25:",h.message)}let a=new Date().toISOString().slice(0,10),g=c.replace(/^\d{4}年\d{1,2}月\d{1,2}日[-_]/,"").replace(/[<>:"/\\|?*]/g,"").replace(/\s+/g,"").slice(0,50),p=this.settings.renderOutputDir||"",m=this.resolveNodejsDir(),l,u,y;e?(l=m?`"${m.replace(/\//g,"\\\\")}\\npx.cmd"`:"npx.cmd",u=`${n}\\out\\video.mp4`,y=`chcp 65001 >nul && cd /d "${n}" && ${l} remotion render src/index.ts ${i} --concurrency=1 --output "out/video.mp4"`):(l=m?`"${m}/npx"`:"npx",u=`${n}/out/video.mp4`,y=`cd "${n}" && ${l} remotion render src/index.ts ${i} --concurrency=1 --output "out/video.mp4"`),console.log("[VideoForge] \u6E32\u67D3\u547D\u4EE4:",y);let f={shell:e?"cmd.exe":"/bin/sh",timeout:6e5,env:{...process.env,PATH:m?`${m}${e?";":":"}${process.env.PATH||""}`:process.env.PATH||""}};if(p){let h=e?`${p.replace(/\//g,"\\\\")}\\${a}-${g}.mp4`:`${p}/${a}-${g}.mp4`;try{t(p,{recursive:!0})}catch(x){}new I.Notice(`\u{1F3AC} \u5F00\u59CB\u6E32\u67D3\u89C6\u9891\uFF0C\u9884\u8BA1 1-3 \u5206\u949F...
\u{1F4C1} ${h}`),await new Promise((x,b)=>{s(y,f,(v,C,F)=>{if(v){console.error("[VideoForge] \u6E32\u67D3\u5931\u8D25:",v.message,F),new I.Notice(`\u26A0\uFE0F \u89C6\u9891\u6E32\u67D3\u5931\u8D25: ${v.message}`),b(v);return}try{let{copyFileSync:$,existsSync:P}=require("fs");if(!P(u)){new I.Notice(`\u26A0\uFE0F \u6E32\u67D3\u5B8C\u6210\u4F46\u6E90\u6587\u4EF6\u4E0D\u5B58\u5728: ${u}`),b(new Error("\u6E90\u6587\u4EF6\u4E0D\u5B58\u5728"));return}$(u,h),new I.Notice(`\u2705 \u89C6\u9891\u6E32\u67D3\u5B8C\u6210\uFF01
\u{1F4C1} ${h}`),x()}catch($){new I.Notice(`\u2705 \u89C6\u9891\u5DF2\u6E32\u67D3\u5230 out/video.mp4
\u26A0\uFE0F \u590D\u5236\u5931\u8D25: ${$.message}`),x()}})})}else new I.Notice("\u{1F3AC} \u5F00\u59CB\u6E32\u67D3\u89C6\u9891\uFF0C\u9884\u8BA1 1-3 \u5206\u949F..."),await new Promise((h,x)=>{s(y,f,(b,v,C)=>{if(b){console.error("[VideoForge] \u6E32\u67D3\u5931\u8D25:",b.message,C),new I.Notice(`\u26A0\uFE0F \u89C6\u9891\u6E32\u67D3\u5931\u8D25: ${b.message}`),x(b);return}new I.Notice(`\u2705 \u89C6\u9891\u6E32\u67D3\u5B8C\u6210\uFF01
\u{1F4C1} ${u}`),h()})})}async stepSplitScenes(s){return this.gemini.splitScenes(s)}async stepTTS(s,t){return this.tts.synthesize(s,t)}async stepTimestamp(s,t){return this.whisper.getTimestamps(s,t)}async stepCompose(s){return this.remotion.composeScenes(s)}async stepGenerateRemotionProject(s){return this.remotion.generateRemotionProject(s)}async cloneVoice(s,t){return new ee(this.settings.minimaxApiKey,this.settings.minimaxGroupId).cloneVoice(s,t)}resolveNodejsDir(){if(this.settings.nodejsPath)return this.settings.nodejsPath;try{let{execSync:s}=require("child_process"),t=require("path"),r=process.platform==="win32"?"where npx":'/bin/zsh -lc "which npx" 2>/dev/null || /bin/bash -lc "which npx"',o=s(r,{encoding:"utf8",timeout:5e3}).toString().trim().split(`
`)[0].trim();if(o)return t.dirname(o)}catch(s){}return""}isAbsolutePath(s){return/^[A-Za-z]:[\\/]/.test(s)||s.startsWith("/")}async saveAudioFile(s,t){if(this.isAbsolutePath(s)){let e=require("fs"),o=require("path").dirname(s);e.mkdirSync(o,{recursive:!0}),e.writeFileSync(s,Buffer.from(t))}else{let e=this.app.vault.adapter,r=s.substring(0,s.lastIndexOf("/"));try{await e.mkdir(r)}catch(o){}await e.writeBinary(s,t)}}async saveProjectData(s){let t=`VideoForge/output/${s.id}/project.json`,e={...s,ttsResults:s.ttsResults.map(o=>({...o,audioBuffer:void 0}))},r=JSON.stringify(e,null,2);if(this.isAbsolutePath(t)){let o=require("fs"),i=require("path").dirname(t);o.mkdirSync(i,{recursive:!0}),o.writeFileSync(t,r,"utf-8")}else{let o=this.app.vault.adapter,n=t.substring(0,t.lastIndexOf("/"));try{await o.mkdir(n)}catch(i){}await o.write(t,r)}}delay(s){return new Promise(t=>setTimeout(t,s))}generateMergedSRT(s,t){var n,i;let e=1,r=0,o=[];for(let c=0;c<s.length;c++){let a=s[c];for(let g of a.segments){let p=g.start+r,m=g.end+r;o.push(`${e}`),o.push(`${this.formatSRTTime(p)} --> ${this.formatSRTTime(m)}`),o.push(g.text),o.push(""),e++}let d=(i=(n=t[c])==null?void 0:n.duration)!=null?i:a.duration;r+=d}return o.join(`
`)}formatSRTTime(s){let t=Math.floor(s/3600),e=Math.floor(s%3600/60),r=Math.floor(s%60),o=Math.round(s%1*1e3);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}:${String(r).padStart(2,"0")},${String(o).padStart(3,"0")}`}async saveSRTFile(s,t){if(this.isAbsolutePath(s)){let e=require("fs"),o=require("path").dirname(s);e.mkdirSync(o,{recursive:!0}),e.writeFileSync(s,t,"utf-8")}else{let e=this.app.vault.adapter,r=s.substring(0,s.lastIndexOf("/"));try{await e.mkdir(r)}catch(o){}await e.write(s,t)}}generateHelloWorldJSX(s,t,e=[],r=null,o="",n=[],i=null){let c=this.parseSRT(s),d=this.mergeToSlides(c).map((g,p)=>{let m=g.lines.map(l=>`      {text: '${l.text.replace(/'/g,"\\'")}', type: "${l.type}", size: ${l.size}, delay: ${l.delay}}`).join(`,
`);return`    // \u5C4F\u5E55${p+1}: ${g.start.toFixed(3)}-${g.end.toFixed(3)}\u79D2
    {start: ${g.start.toFixed(3)}, end: ${g.end.toFixed(3)}, lines: [
${m}
    ]}`}).join(`,

`);return this.buildHelloWorldJSX(d,t,s,e,r,o,n,null,i)}generateHelloWorldJSXFromSlides(s,t,e,r=[],o=null,n="",i=[],c=null,a=null){let d=s.map((g,p)=>{let m=(g.lines||[]).filter(l=>{let u=(l.text||"").trim();return u.length>0&&!u.includes("...")}).map(l=>{let u=(l.text||"").replace(/\u201c/g,'"').replace(/\u201d/g,'"');return u=u.replace(/[，。！？、；：""''…—·\,\.\!\?\;\:\"\'\-\(\)\[\]【】《》「」\u3000]/g,""),this.visualUnits(u)>8&&(u=this.smartTruncate(u,8)),`      {text: '${u.replace(/'/g,"\\'")}', type: "${l.type||"normal"}", size: ${l.size||64}, delay: ${l.delay||0}}`}).join(`,
`);return`    // \u5C4F\u5E55${p+1}: ${(g.start||0).toFixed(3)}-${(g.end||0).toFixed(3)}\u79D2
    {start: ${(g.start||0).toFixed(3)}, end: ${(g.end||0).toFixed(3)}, lines: [
${m}
    ]}`}).join(`,

`);return this.buildHelloWorldJSX(d,t,e,r,o,n,i,c,a)}async checkAndRefineSlides(s,t){let e=this.parseSRT(t);if(e.length===0||s.length===0)return s;let r=/[，。！？、；：""''…—·,.\!\?;\:\"\'\-\(\)\[\]【】《》「」\u3000]/g,o=e.map(a=>a.text.replace(r,"")),n=[];for(let a=0;a<s.length;a++){let d=s[a],g=d.lines||[];for(let p of g){let m=(p.text||"").replace(r,"");if(!(m.length<4)){for(let l of o)if((l.includes(m)||m.includes(l))&&Math.min(m.length,l.length)/Math.max(m.length,l.length)>.6){n.push({slideIdx:a,start:d.start||0,end:d.end||0,text:p.text||"",subtitleText:l});break}}}}let i=n.length/Math.max(s.reduce((a,d)=>{var g;return a+(((g=d.lines)==null?void 0:g.length)||0)},0),1);if(console.log(`[checkAndRefineSlides] \u91CD\u590D\u7387: ${(i*100).toFixed(1)}% (${n.length}/${Math.max(s.reduce((a,d)=>{var g;return a+(((g=d.lines)==null?void 0:g.length)||0)},0),1)} lines)`),i<.3)return console.log("[checkAndRefineSlides] \u91CD\u590D\u7387 < 30%\uFF0C\u8DF3\u8FC7\u8865\u8003"),s;let c=n.filter((a,d,g)=>g.findIndex(p=>p.slideIdx===a.slideIdx)===d);console.log(`[checkAndRefineSlides] \u89E6\u53D1 Gemini \u8865\u8003\uFF0C\u4FEE\u590D ${c.length} \u5C4F...`);try{let a=await this.gemini.refineSlides(c);if(console.log(`[checkAndRefineSlides] Gemini \u8865\u8003\u8FD4\u56DE: ${(a==null?void 0:a.length)||0} \u5C4F`),!Array.isArray(a)||a.length===0)return s;for(let d of a){let g=(typeof d.index=="number"?d.index:0)-1;if(g<0||g>=c.length)continue;let m=c[g].slideIdx;m>=0&&m<s.length&&d.lines&&(s[m].lines=d.lines.map((l,u)=>({text:(l.text||"").replace(r,""),type:l.type||"accent",size:l.size||72,delay:u*.12})))}new I.Notice(`\u{1F527} Video Forge: Gemini \u8865\u8003\u4FEE\u590D\u4E86 ${a.length} \u5C4F\u91CD\u590D slides`)}catch(a){console.warn("Gemini refineSlides \u5931\u8D25:",a.message)}return s}sanitizeSlides(s,t){if(!s||s.length===0)return s;let e=this.parseSRT(t);if(e.length===0)return s;let r=e[0].start,o=e[e.length-1].end;s.sort((a,d)=>(a.start||0)-(d.start||0));for(let a=1;a<s.length;a++)s[a].start<s[a-1].end&&(s[a].start=s[a-1].end),s[a].start>=s[a].end&&(s[a]._invalid=!0);s=s.filter(a=>!a._invalid);let n=[];for(let a of s)n.push(a);let i=.4,c=.5;for(let a of n)(a.end||0)-(a.start||0)>i+c&&(a.start=(a.start||0)+i);return n}async matchBGM(s){var t;try{let e=this.settings.bgmFolderPath||"VideoForge/BGM",r=this.app.vault.adapter,o=`${this.settings.remotionProjectPath||"VideoForge/remotion-project"}/public`,n=[];try{n=(await r.list(e)).files.filter(d=>d.toLowerCase().endsWith(".mp3"))}catch(a){return null}if(n.length===0)return null;let i=`${e}/BGM\u7D22\u5F15.md`,c=null;try{let a=await r.read(i),d={};for(let l of s){let u=l.emotion||"neutral";d[u]=(d[u]||0)+1}let g=((t=Object.entries(d).sort((l,u)=>u[1]-l[1])[0])==null?void 0:t[0])||"neutral",p=a.split(`
`).filter(l=>l.startsWith("|")&&!l.includes("\u6587\u4EF6\u540D")&&!l.includes("---")),m=[];for(let l of p){let u=l.split("|").map(y=>y.trim()).filter(Boolean);u.length>=2&&u[0].endsWith(".mp3")&&m.push({fileName:u[0],emotion:u[1]})}if(m.length>0){let l=m.find(u=>u.emotion===g)||m.find(u=>u.emotion==="neutral")||m[0];c=`${e}/${l.fileName}`,new I.Notice(`\u{1F3B5} BGM \u60C5\u7EEA\u5339\u914D: ${l.fileName}\uFF08${l.emotion}\uFF09`)}}catch(a){}if(!c){let a=Math.floor(Math.random()*n.length);c=n[a];let d=c.split("/").pop()||c;new I.Notice(`\u{1F3B5} BGM \u968F\u673A\u9009\u62E9: ${d}`)}try{let a=await r.readBinary(c),g=(c.split("/").pop()||c).replace(/\s+/g,"_");return await r.writeBinary(`${o}/${g}`,a),g}catch(a){let d=c.split("/").pop()||c;return new I.Notice(`\u26A0\uFE0F BGM \u6587\u4EF6\u4E0D\u5B58\u5728: ${d}`),null}}catch(e){return new I.Notice(`\u26A0\uFE0F BGM \u5339\u914D\u5931\u8D25: ${e.message}`),null}}buildHelloWorldJSX(s,t,e,r=[],o=null,n="",i=[],c=null,a=null){var h,x;let d=this.settings.defaultStyle,g=(this.settings.videoHeight||1080)>(this.settings.videoWidth||1920),p=g?{containerPadding:"0 48px",slideGap:20,slideMaxWidth:900,captionBottom:280,captionMaxWidth:900,captionBorderRadius:12,captionPadding:"12px 24px",captionFontSize:d.subtitleFontSize||46,sizeScale:1}:{containerPadding:"0 120px",slideGap:32,slideMaxWidth:1400,captionBottom:80,captionMaxWidth:1200,captionBorderRadius:12,captionPadding:"12px 24px",captionFontSize:d.subtitleFontSize||46,sizeScale:1.15},l=this.parseSRT(e).map(b=>{let v=b.text.replace(/[。！？、；：""''…—·\.\!\?\;\:\'\-\(\)\[\]【】《》\u3000]/g,"").replace(/[，,]+$/g,"").replace(/"/g,'\\"');return`    {start: ${b.start.toFixed(3)}, end: ${b.end.toFixed(3)}, text: "${v}"}`}).join(`,
`),u=r.map(b=>`    {fileName: "${b.fileName}", start: ${b.start}, end: ${b.end}}`).join(`,
`),y=i.map(b=>`    {fileName: "${b.fileName}", start: ${b.start}, end: ${b.end}}`).join(`,
`),f=["","  // ========== \u3010\u56FA\u5B9A\u533A\u3011\u5F00\u59CB - \u82F9\u679C\u52A8\u753B\u6548\u679C\u6838\u5FC3\u4EE3\u7801 ==========","","  // \u9884\u5904\u7406\uFF1A\u6D88\u9664 slides \u4E4B\u95F4\u7684\u95F4\u9699\uFF0C\u8BA9\u6BCF\u5C4F end \u5EF6\u4F38\u5230\u4E0B\u4E00\u5C4F start","  for (let i = 0; i < slides.length - 1; i++) {","    if (slides[i + 1].start > slides[i].end) {","      slides[i].end = slides[i + 1].start;","    }","  }","  // \u540C\u6837\u6D88\u9664 subtitles \u95F4\u9699","  for (let i = 0; i < subtitles.length - 1; i++) {","    if (subtitles[i + 1].start > subtitles[i].end) {","      subtitles[i].end = subtitles[i + 1].start;","    }","  }","","  const FADE_OUT_TIME = 0.3;","  const currentSub = slides.find(","    (s) => currentTime >= s.start && currentTime < s.end","  );","","  const currentCaption = subtitles.find(","    (s) => currentTime >= s.start && currentTime < s.end","  );","","  // \u753B\u4E2D\u753B\uFF1A\u627E\u5230\u5F53\u524D\u65F6\u95F4\u5BF9\u5E94\u7684\u56FE\u7247","  const currentImage = images.find(","    (img) => currentTime >= img.start && currentTime < img.end","  );","","  // \u753B\u4E2D\u753B\u6DE1\u5165\u6DE1\u51FA\u52A8\u753B","  const getPipAnimation = () => {","    if (!currentImage) return { opacity: 0, scale: 0.9 };","    const elapsed = currentTime - currentImage.start;","    const remaining = currentImage.end - currentTime;","    const fadeIn = spring({","      frame: Math.max(0, elapsed * fps),","      fps,","      config: { damping: 200, stiffness: 300, mass: 0.5 },","    });","    const fadeOut = remaining < 0.5 ? remaining / 0.5 : 1;","    const opacity = Math.min(fadeIn, fadeOut);","    const scale = interpolate(fadeIn, [0, 1], [0.9, 1]);","    return { opacity, scale };","  };","","  const getLineAnimation = (line, index) => {","    if (!currentSub) return { opacity: 0, scale: 0.8, y: 20 };","    const elapsed = currentTime - currentSub.start - (line.delay || 0);","    const remaining = currentSub.end - currentTime;","    // \u6DE1\u5165","    const fadeIn = spring({","      frame: Math.max(0, (elapsed * fps)),","      fps,","      config: { damping: 200, stiffness: 300, mass: 0.5 },","    });","    // \u6DE1\u51FA\uFF1A\u6700\u540E FADE_OUT_TIME \u79D2\u5185\u6E10\u9690","    const fadeOut = remaining < FADE_OUT_TIME ? Math.max(0, remaining / FADE_OUT_TIME) : 1;","    const progress = Math.min(fadeIn, fadeOut);","    return {","      opacity: progress,","      scale: interpolate(progress, [0, 1], [0.85, 1]),","      y: interpolate(progress, [0, 1], [30, 0]),","    };","  };","","  const getAppleStyle = (line) => {","    const baseStyle = {","      fontFamily: `${fontFamily}, -apple-system, SF Pro Display, system-ui, sans-serif`,","      textAlign: 'center',","      letterSpacing: '-0.5px',","      lineHeight: 1.2,","      WebkitFontSmoothing: 'antialiased',","      MozOsxFontSmoothing: 'grayscale',","    };","    switch (line.type) {","      case 'hero':","        return {","          ...baseStyle, fontSize: line.size * sizeScale,",`          fontWeight: '900', color: '${d.heroColor}',`,"          letterSpacing: '-2px',","          textShadow: '0 2px 40px rgba(255, 255, 255, 0.15)',","        };","      case 'accent':","        return {","          ...baseStyle, fontSize: line.size * sizeScale,",`          fontWeight: '700', color: '${d.accentColor}',`,"          letterSpacing: '-1px',","        };","      case 'gradient':","        return {","          ...baseStyle, fontSize: line.size * sizeScale,","          fontWeight: '800',",`          background: 'linear-gradient(90deg, ${d.gradientFrom}, ${d.gradientTo})',`,"          WebkitBackgroundClip: 'text',","          WebkitTextFillColor: 'transparent',","          letterSpacing: '-1px',","        };","      case 'normal':","        return {","          ...baseStyle, fontSize: line.size * sizeScale,",`          fontWeight: '600', color: '${d.fontColor}',`,"          letterSpacing: '-0.5px',","        };","      case 'sub':","        return {","          ...baseStyle, fontSize: line.size * sizeScale,",`          fontWeight: '500', color: '${d.subColor}',`,"          letterSpacing: '0px',","        };","      default:","        return {","          ...baseStyle, fontSize: line.size * sizeScale,","          fontWeight: '600', color: '#F5F5F7',","        };","    }","  };","","  // \u5E95\u90E8\u5B57\u5E55\u6DE1\u5165\u6DE1\u51FA\u52A8\u753B","  const getCaptionOpacity = () => {","    if (!currentCaption) return 0;","    const elapsed = currentTime - currentCaption.start;","    const remaining = currentCaption.end - currentTime;","    const fadeIn = spring({","      frame: Math.max(0, elapsed * fps),","      fps,","      config: { damping: 200, stiffness: 400, mass: 0.3 },","    });","    const fadeOut = remaining < 0.15 ? Math.max(0, remaining / 0.15) : 1;","    return Math.min(fadeIn, fadeOut);","  };","","  return (","    <div style={{","      flex: 1,",`      backgroundColor: '${d.bgColor}',`,"      justifyContent: 'center',","      alignItems: 'center',","      display: 'flex',","      flexDirection: 'column',",`      padding: '${p.containerPadding}',`,"      position: 'relative',","    }}>","      {/* \u683C\u5B50\u80CC\u666F */}","      <div style={{","        position: 'absolute',","        top: 0,","        left: 0,","        width: '100%',","        height: '100%',","        backgroundImage: `","          linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),","          linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)","        `,","        backgroundSize: '60px 60px',","        zIndex: 0,","        pointerEvents: 'none',","      }} />","      <Audio src={staticFile(audioFile)} />","","      {/* \u5C01\u9762\uFF08\u89C6\u9891\u7B2C\u4E00\u5E27\uFF09 */}","      {coverImage && currentTime < coverDuration && (","        <div style={{","          position: 'absolute',","          top: 0,","          left: 0,","          width: '100%',","          height: '100%',","          zIndex: 100,","        }}>","          <Img","            src={staticFile(coverImage)}","            style={{","              width: '100%',","              height: '100%',","              objectFit: 'cover',","            }}","          />","        </div>","      )}","","      {/* \u9876\u90E8\u5927\u6807\u9898 */}","      {topTitle && (() => {","        const revealPos = interpolate(frame, [0, fps * 3], [-20, 120], {extrapolateRight: 'clamp'});","        return (","      <div style={{","        position: 'absolute',","        top: 160,","        left: 0,","        right: 0,","        zIndex: 10,","        textAlign: 'center',","        background: 'rgba(30, 40, 60, 0.35)',","        backdropFilter: 'blur(12px)',","        padding: '28px 48px',","        WebkitMaskImage: `linear-gradient(to right, black ${revealPos - 20}%, transparent ${revealPos}%)`,","        maskImage: `linear-gradient(to right, black ${revealPos - 20}%, transparent ${revealPos}%)`,","      }}>","        {topTitle.map((titleLine, li) => (","          <div key={li} style={{","            fontFamily: `${fontFamily}, -apple-system, SF Pro Display, system-ui, sans-serif`,","            fontSize: 88,","            fontWeight: '300',","            color: 'rgba(255,255,255,0.85)',","            lineHeight: 1.25,","            letterSpacing: '-1px',","            textShadow: '0 3px 16px rgba(0,0,0,0.7)',","          }}>","            {titleLine.map((seg, si) => (","              <span key={si} style={{","                fontWeight: seg.bold ? '900' : '300',","                color: seg.bold ? '#ffffff' : 'rgba(255,255,255,0.85)',","                fontSize: seg.size || 88,","              }}>{seg.text}</span>","            ))}","          </div>","        ))}","      </div>","        );","      })()}","","      {bgmFile && <Audio","        src={staticFile(bgmFile)}","        loop","        volume={(f) => {","          const t = f / fps;","          const fadeIn = interpolate(t, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});","          const fadeOut = interpolate(t, [totalDuration - 5, totalDuration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});","          return bgmVolume * fadeIn * fadeOut;","        }}","      />}","","      {/* \u5D4C\u5165\u89C6\u9891\u7D20\u6750 */}","      {videos.map((v, vi) => (","        currentTime >= v.start && currentTime < v.end && (","          <div key={vi} style={{","            position: 'absolute',","            top: topTitle ? 420 : 0,","            left: 0,","            width: '100%',","            height: topTitle ? 'calc(100% - 420px)' : '100%',","            zIndex: 5,","            pointerEvents: 'none',","          }}>","            <Video","              src={staticFile(v.fileName)}","              startFrom={0}","              style={{","                width: '100%',","                height: '100%',","                objectFit: 'contain',","              }}","              volume={0}","            />","          </div>","        )","      ))}","","      {/* \u5168\u5C4F\u80CC\u666F\u56FE\u7247 */}","      {currentImage && (() => {","        const pipAnim = getPipAnimation();","        return (","          <>","            <div style={{","              position: 'absolute',","              top: topTitle ? 420 : 0,","              left: 0,","              width: '100%',","              height: topTitle ? 'calc(100% - 420px)' : '100%',","              overflow: 'hidden',","              opacity: pipAnim.opacity,","              transform: `scale(${pipAnim.scale})`,","              pointerEvents: 'none',","              zIndex: 5,","            }}>","              <Img","                src={staticFile(currentImage.fileName)}","                style={{","                  width: '100%',","                  height: '100%',","                  objectFit: 'contain',","                }}","              />","            </div>","          </>","        );","      })()}","","      {/* PPT \u5173\u952E\u8BCD\u533A\u57DF\uFF08\u5C45\u4E2D\uFF0C\u9650\u5236\u5728\u6807\u9898\u4EE5\u4E0B\uFF09 */}","      <div style={{","        position: 'absolute',","        top: topTitle ? 420 : 0,","        left: 0,","        width: '100%',","        height: topTitle ? `calc(100% - 420px - 200px)` : `calc(100% - 200px)`,","        display: 'flex',","        flexDirection: 'column',",`        gap: ${p.slideGap},`,"        alignItems: 'center',","        justifyContent: 'center',",`        padding: '${p.containerPadding}',`,"        zIndex: 3,","        pointerEvents: 'none',","      }}>","        {currentSub && currentSub.lines.map((line, i) => {","          const anim = getLineAnimation(line, i);","          return (","            <div","              key={i}","              style={{","                ...getAppleStyle(line),","                opacity: anim.opacity,","                transform: `translateY(${anim.y}px) scale(${anim.scale})`,","                transition: 'none',","              }}","            >","              {line.text}","            </div>","          );","        })}","      </div>","","      {/* \u5E95\u90E8\u5B57\u5E55\u6761 */}","      {currentCaption && (() => {",`        const charWidth = ${p.captionFontSize};`,"        const textWidth = currentCaption.text.length * charWidth + 48;",`        const maxWidth = ${this.settings.videoWidth||1920} - 40;`,"        const captionScale = textWidth > maxWidth ? maxWidth / textWidth : 1;","        return (","        <div style={{","          position: 'absolute',",`          bottom: ${p.captionBottom},`,"          left: 0,","          right: 0,","          display: 'flex',","          justifyContent: 'center',","          alignItems: 'center',","          opacity: getCaptionOpacity(),","          zIndex: 8,","          transform: `scale(${captionScale})`,","        }}>","          <div style={{",`            background: '${d.subtitleBgColor}',`,`            borderRadius: ${p.captionBorderRadius},`,`            padding: '${p.captionPadding}',`,"            whiteSpace: 'nowrap',","          }}>","            <span style={{","              fontFamily: `${fontFamilyRegular}, ${fontFamily}, -apple-system, SF Pro Display, system-ui, sans-serif`,",`              fontSize: ${p.captionFontSize},`,"              fontWeight: '500',","              color: 'rgba(255, 255, 255, 0.95)',","              letterSpacing: '0.5px',","              lineHeight: 1.4,","              textAlign: 'center',","            }}>","              {currentCaption.text}","            </span>","          </div>","        </div>","        );","      })()}","    </div>","  );","","  // ========== \u3010\u56FA\u5B9A\u533A\u3011\u7ED3\u675F ==========","};"].join(`
`);return`import {useCurrentFrame, useVideoConfig, Audio, Video, Img, staticFile, interpolate, spring} from 'remotion';

const fontFamily = '${d.fontFamily}';
const fontFamilyRegular = '${d.fontFamily}-Regular';

const fontFace = new FontFace(fontFamily, \`url('\${staticFile('AlibabaPuHuiTi-3-45-Light.ttf')}')\`);
fontFace.load().then((f) => document.fonts.add(f));

const fontFaceRegular = new FontFace(fontFamilyRegular, \`url('\${staticFile('AlibabaPuHuiTi-3-55-Regular.ttf')}')\`);
fontFaceRegular.load().then((f) => document.fonts.add(f));

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const currentTime = frame / fps;
  const totalDuration = durationInFrames / fps;

  // ========== \u3010\u53D8\u91CF\u533A\u3011\u5F00\u59CB ==========

  // \u3010\u53D8\u91CF1\u3011slides \u6570\u7EC4\uFF1APPT\u98CE\u683C\uFF0C\u4E00\u5C4F\u591A\u884C\uFF0C\u82F9\u679C\u914D\u8272
  const slides = [
${s}
  ];

  // \u3010\u53D8\u91CF2\u3011audioFile\uFF1A\u97F3\u9891\u6587\u4EF6\u540D
  const audioFile = '${t}';

  // \u3010\u53D8\u91CF3\u3011bgmFile \u548C bgmVolume\uFF1A\u80CC\u666F\u97F3\u4E50\u914D\u7F6E
  const bgmFile = ${o?`'${o}'`:"null"};
  const bgmVolume = ${(h=d.bgmVolume)!=null?h:.3};

  // \u3010\u53D8\u91CF4\u3011subtitles \u6570\u7EC4\uFF1A\u5E95\u90E8\u9010\u53E5\u5B57\u5E55\uFF08\u6765\u81EA SRT\uFF09
  const subtitles = [
${l}
  ];

  // \u3010\u53D8\u91CF5\u3011images \u6570\u7EC4\uFF1A\u753B\u4E2D\u753B\u56FE\u7247\uFF08\u6765\u81EA\u6587\u6848\u4E2D\u7684 ![[xxx.png]]\uFF09
  const images = [
${u}
  ];

  // \u3010\u53D8\u91CF6\u3011videos \u6570\u7EC4\uFF1A\u5D4C\u5165\u89C6\u9891\u7D20\u6750\uFF08\u6765\u81EA\u6587\u6848\u4E2D\u7684 ![[xxx.mp4]]\uFF09
  const videos = [
${y}
  ];

  // \u3010\u53D8\u91CF7\u3011coverImage\uFF1A\u5C01\u9762\u56FE\u7247\uFF08\u89C6\u9891\u7B2C\u4E00\u5E27\uFF09
  const coverImage = ${a?`'${a}'`:"null"};
  const coverDuration = ${(x=this.settings.coverDurationSec)!=null?x:.1};

  // ========== \u3010\u53D8\u91CF\u533A\u3011\u7ED3\u675F ==========

  // \u3010\u5E03\u5C40\u3011\u5B57\u53F7\u7F29\u653E\u56E0\u5B50\uFF08\u7AD6\u5C4F\u81EA\u52A8\u7F29\u5C0F\uFF09
  const sizeScale = ${p.sizeScale};
  const isPortrait = ${g};
  const videoTitle = '${n.replace(/'/g,"\\'")}';
  ${this.generateTopTitleCode(n,g,c)}
`+f+`
`}generateTopTitleCode(s,t,e=null){return"const topTitle = null;"}extractKeywords(s){let t=s.replace(/[，。！？、；：\u201c\u201d\u2018\u2019…—·,.\!\?;\:\"\'\-\(\)\[\]【】《》「」\u3000]/g,"");if(this.visualUnits(t)<=3)return t;let e=new Set(["\u6211","\u4F60","\u4ED6","\u5979","\u5B83","\u6211\u4EEC","\u4F60\u4EEC","\u4ED6\u4EEC","\u8FD9","\u90A3","\u8FD9\u4E2A","\u90A3\u4E2A","\u8FD9\u4E9B","\u90A3\u4E9B","\u54EA\u4E2A","\u81EA\u5DF1","\u5927\u5BB6","\u7684","\u4E86","\u7740","\u5417","\u5462","\u5427","\u554A","\u5440","\u54E6","\u561B","\u54C8","\u55EF","\u5730","\u5F97","\u4F46\u662F","\u4F46","\u800C\u4E14","\u5E76\u4E14","\u6240\u4EE5","\u56E0\u4E3A","\u5982\u679C","\u867D\u7136","\u4E0D\u8FC7","\u7136\u540E","\u800C\u662F","\u5C31\u662F","\u53EA\u662F","\u53EF\u662F","\u6216\u8005","\u4EE5\u53CA","\u4ECE","\u5411","\u5BF9","\u8DDF","\u548C","\u4E0E","\u6BD4","\u6309","\u4E3A","\u5F80","\u4E0A","\u4E0B","\u91CC","\u4E2D","\u524D","\u540E","\u5185","\u5916","\u4E00\u6B3E","\u4E00\u5806","\u4E00\u7FA4","\u4E00\u5957","\u4E00\u6BB5","\u4E00\u7BC7","\u4E00\u4E2A","\u4E2A","\u4E9B","\u79CD","\u6761","\u4EF6","\u6309\u7406\u8BF4","\u8BF4\u767D\u4E86","\u8BF4\u5B9E\u8BDD","\u8001\u5B9E\u8BF4","\u4E0D\u5F97\u4E0D\u8BF4","\u5F53\u65F6","\u540E\u6765","\u4E4B\u540E","\u4EE5\u540E","\u4EE5\u524D","\u4E4B\u524D","\u4E00\u4E0B","\u4E00\u70B9","\u4E00\u4E9B","\u4E00\u6837","\u4E00\u8D77","\u8FD9\u6837","\u90A3\u6837","\u8FD9\u4E48","\u90A3\u4E48","\u600E\u4E48\u6837","\u73A9\u610F","\u73A9\u610F\u513F","\u8FD9\u73A9\u610F","\u8FD9\u73A9\u610F\u513F","\u90A3\u73A9\u610F","\u90A3\u73A9\u610F\u513F","\u8FD9\u4E1C\u897F","\u90A3\u4E1C\u897F"]),r=new Set(["\u8FC7","\u5C31","\u90FD","\u4E5F","\u8FD8","\u53C8","\u518D","\u5F88","\u592A","\u6700","\u66F4","\u975E\u5E38","\u7279\u522B","\u5176\u5B9E","\u786E\u5B9E","\u771F\u7684","\u57FA\u672C\u4E0A","\u57FA\u672C","\u5B9E\u5728","\u5B8C\u5168","\u4E00\u76F4","\u5DF2\u7ECF","\u6B63\u5728","\u662F","\u6709","\u5728","\u88AB","\u628A","\u7ED9","\u8BA9","\u53EB","\u53EB\u505A","\u505A","\u5230","\u53BB","\u6765","\u80FD","\u4F1A","\u53EF\u4EE5","\u5E94\u8BE5","\u9700\u8981","\u60F3","\u8981","\u597D","\u4E0D","\u6CA1","\u6CA1\u6709","\u4E0D\u662F","\u751A\u81F3","\u50CF","\u7B97","\u7B97\u662F","\u51FA","\u8FDE","\u53CD\u800C","\u5C45\u7136","\u7ADF\u7136","\u679C\u7136","\u4EC0\u4E48","\u600E\u4E48","\u4E1C\u897F","\u4E8B\u60C5","\u65F6\u5019","\u5730\u65B9","\u95EE\u9898","\u6574","\u641E","\u5F04","\u642C","\u62FF","\u6BCF","\u6BCF\u4E2A"]),o=[...e,...r].filter(d=>d.length>=2).sort((d,g)=>g.length-d.length),n=(d,g)=>{let p=this.tokenize(t),m=[],l=0;for(;l<p.length;){let u=!1;for(let y of g){if(!d.has(y))continue;let f=this.tokenize(y);if(l+f.length<=p.length&&p.slice(l,l+f.length).join("")===y){l+=f.length,u=!0;break}}if(!u){if(p[l].length===1&&d.has(p[l])){l++;continue}m.push(p[l]),l++}}return m.join("")},i=n(new Set([...e,...r]),o);if(this.visualUnits(i)>=2&&this.visualUnits(i)<=6)return i;let c=[...e].filter(d=>d.length>=2).sort((d,g)=>g.length-d.length),a=n(e,c);return this.visualUnits(a)>=2&&this.visualUnits(a)<=6?a:this.visualUnits(a)>6?this.smartTruncate(a,6):this.smartTruncate(t,5)}tokenize(s){let t=[],e=0;for(;e<s.length;){let r=s[e];if(/[a-zA-Z]/.test(r)){let o="";for(;e<s.length&&/[a-zA-Z]/.test(s[e]);)o+=s[e],e++;t.push(o)}else if(/[0-9]/.test(r)){let o="";for(;e<s.length&&/[0-9.]/.test(s[e]);)o+=s[e],e++;e<s.length&&/[万亿千百个条篇颗%+]/.test(s[e])&&(o+=s[e],e++),t.push(o)}else/[\u4e00-\u9fff\u3400-\u4dbf]/.test(r)&&t.push(r),e++}return t}visualUnits(s){return this.tokenize(s).length}smartTruncate(s,t){let e=this.tokenize(s);if(e.length<=t)return s;let r=new Set(["\u6211","\u4F60","\u4ED6","\u5979","\u5B83","\u4EEC","\u7684","\u4E86","\u5728","\u662F","\u6709","\u5C31","\u90FD","\u4E5F","\u8FD8","\u628A","\u88AB","\u8BA9","\u7ED9","\u5230","\u53BB","\u6765","\u80FD","\u4F1A","\u8981","\u53EF\u4EE5","\u56E0\u4E3A","\u6240\u4EE5","\u4F46\u662F","\u7136\u540E","\u5982\u679C","\u867D\u7136","\u57FA\u672C\u4E0A","\u5B9E\u5728","\u5B8C\u5168","\u5176\u5B9E","\u4E00\u4E2A","\u8FD9\u4E2A","\u90A3\u4E2A","\u4EC0\u4E48","\u600E\u4E48","\u6309\u7406\u8BF4","\u8BF4\u767D\u4E86","\u8FD9\u4E1C\u897F","\u800C","\u4E0D","\u53C8","\u5BF9","\u5F88","\u5730","\u5F97","\u7740","\u8FC7","\u5417","\u5462","\u5427","\u554A","\u5440","\u561B","\u54E6","\u54C8","\u55EF"]),o=e.filter(n=>!r.has(n));if(o.length>0&&o.length<=t){let n=o.join("");if(n.length>=2)return n}return o.length>t?o.slice(0,t).join(""):e.slice(0,t).join("")}calculateSimilarity(s,t){if(!s||!t)return 0;let e=s.length<t.length?s:t,r=s.length>=t.length?s:t,o=0;for(let n=0;n<=r.length-e.length;n++){let i=0;for(let c=0;c<e.length;c++)r[n+c]===e[c]&&i++;o=Math.max(o,i)}return o/Math.max(s.length,t.length)}autoFixGeneratedJSX(s){let t=[],e=s,r=/[，。！？、；：\u201c\u201d\u2018\u2019…—·,.\!\?;\:\"\'\-\(\)\[\]【】《》「」\u3000]/g,o=e;e=e.replace(/,\s*\.\.\.\s*\}/g,"}"),e=e.replace(/\{\s*\.\.\.\s*\}/g,""),e=e.replace(/,\s*,/g,","),e=e.replace(/\[\s*,/g,"["),e=e.replace(/,\s*\]/g,"]"),e!==o&&t.push("\u{1F527} \u6E05\u7406AI\u7701\u7565\u53F7\u8BED\u6CD5\uFF08...\uFF09"),e=e.replace(/\{text:\s*('[^']*')\s*\}/g,'{text: $1, type: "normal", size: 64, delay: 0}');let n=/(\{text:\s*)"((?:[^"\\]|\\.)*)"/g,i=e;if(e=e.replace(n,(d,g,p)=>{if(/[\u4e00-\u9fff]/.test(p)){let m=p.replace(/\\"/g,'"').replace(/'/g,"\\'");return`${g}'${m}'`}return d}),e!==i){let d=(i.match(/\{text:\s*"[^"]*[\u4e00-\u9fff]/g)||[]).length;t.push(`\u{1F527} esbuild\u517C\u5BB9: ${d}\u5904 text \u53CC\u5F15\u53F7\u2192\u5355\u5F15\u53F7`)}let c=e.match(/const slides = \[([\s\S]*?)\n  \];/);if(c){let d=0,p=c[1].replace(/(\{text:\s*')([^']*?)(')/g,(y,f,h,x)=>{let b=h.replace(r,"");return b!==h?(d++,`${f}${b}${x}`):y});d>0&&(e=e.replace(c[1],p),t.push(`\u{1F527} \u53BB\u6807\u70B9: ${d}\u5904 slide text \u6807\u70B9\u5DF2\u53BB\u9664`));let m=e.match(/const slides = \[([\s\S]*?)\n  \];/);if(m){let y=0,h=m[1].replace(/(\{text:\s*')([^']*?)(')/g,(x,b,v,C)=>this.visualUnits(v)>8?(y++,`${b}${this.smartTruncate(v,8)}${C}`):x);y>0&&(e=e.replace(m[1],h),t.push(`\u{1F527} \u667A\u80FD\u622A\u65AD: ${y}\u5904 slide text \u8D858\u89C6\u89C9\u5355\u4F4D\u5DF2\u622A\u65AD\uFF08\u4FDD\u7559\u5B8C\u6574\u82F1\u6587\u5355\u8BCD\uFF09`))}let l=e.match(/const slides = \[([\s\S]*?)\n  \];/);if(l){let y=0,h=l[1].replace(/\{start:[\s\S]*?lines:\s*\[([\s\S]*?)\]\s*\}/g,(x,b)=>{let v=[...b.matchAll(/size:\s*(\d+)/g)];if(v.length<=1)return x;let C=v.map(D=>parseInt(D[1])),F=Math.max(...C),$=Math.min(...C);if(F-$<=40)return x;let P=F-40,k=b.replace(/(size:\s*)(\d+)/g,(D,W,X)=>parseInt(X)<P?(y++,`${W}${P}`):D);return x.replace(b,k)});y>0&&(e=e.replace(l[1],h),t.push(`\u{1F527} size\u5DEE\u8DDD: ${y}\u5904 size \u5DEE\u8DDD\u8D8540px\u5DF2\u4FEE\u6B63`))}let u=e.match(/const slides = \[([\s\S]*?)\n  \];/);if(u){let y=0,f=u[1],h=f.length;for(let x=0;x<5&&(f=f.replace(/\{text:\s*'([^']*[a-zA-Z])',\s*type:\s*"([^"]*)",\s*size:\s*(\d+),\s*delay:\s*(\d+)\},?\s*\n?\s*\{text:\s*'([a-z][^']*)',\s*type:\s*"([^"]*)",\s*size:\s*(\d+),\s*delay:\s*(\d+)\}/g,(v,C,F,$,P,k,D,W,X)=>{let G=C.match(/[a-zA-Z]+$/),K=k.match(/^[a-zA-Z]+/);if(G&&K){let H=G[0]+K[0],O=C.substring(0,C.length-G[0].length)+H,Y=k.substring(K[0].length).trim();return y++,Y.length===0?`{text: '${O}', type: "${F}", size: ${$}, delay: ${P}}`:`{text: '${O}', type: "${F}", size: ${$}, delay: ${P}},
      {text: '${Y}', type: "${D}", size: ${W}, delay: ${X}}`}return v}),f.length!==h);x++)h=f.length;y>0&&(e=e.replace(u[1],f),t.push(`\u{1F527} \u82F1\u6587\u5408\u5E76: ${y}\u5904\u88AB\u62C6\u65AD\u7684\u82F1\u6587\u5355\u8BCD\u5DF2\u5408\u5E76`))}}let a=e.match(/const topTitle = \[([\s\S]*?)\n  \];/);if(a){let d=0,p=a[1].replace(/\[([^\]]*)\]/g,(l,u)=>{let y=[...u.matchAll(/text:\s*'([^']*)'/g)];if(y.length<=1)return l;let f=y.map(F=>F[1]).join(""),h=u.match(/bold:\s*(true|false)/),x=u.match(/size:\s*(\d+)/),b=h?h[1]==="true":!1,v=x?parseInt(x[1]):96;return d++,`[{text: '${f}'${b?", bold: true":""}, size: ${v}}]`});if(p=p.replace(/(\{text:\s*')([^']*?)(')/g,(l,u,y,f)=>{let h=y.replace(r,"");return h!==y?(d++,`${u}${h}${f}`):l}),p=p.replace(/(\{text:\s*')([^']*?)(')/g,(l,u,y,f)=>y.length>10?(d++,`${u}${this.smartTruncate(y,8)}${f}`):l),[...p.matchAll(/\[[^\]]*\]/g)].length>2){d++;let l=[...p.matchAll(/(\s*\[[^\]]*\]),?/g)];if(l.length>2){for(let u=l.length-1;u>=2;u--)p=p.replace(l[u][0],"");p=p.replace(/,(\s*$)/,"$1")}}d>0&&(e=e.replace(a[1],p),t.push(`\u{1F527} topTitle: ${d}\u5904\u5DF2\u4FEE\u590D\uFF08\u5408\u5E76segment/\u53BB\u6807\u70B9/\u63D0\u70BC/\u622A\u65AD\uFF09`))}return{fixed:e,fixes:t}}validateGeneratedJSX(s,t,e,r,o){var u,y;let n=[],i=s.matchAll(/\{text:\s*"([^"]*[\u4e00-\u9fff][^"]*)"/g);for(let f of i)n.push(`\u274C esbuild \u517C\u5BB9\u6027: text \u7528\u4E86\u53CC\u5F15\u53F7\u5305\u88F9\u4E2D\u6587\u300C${f[1].substring(0,10)}\u2026\u300D\uFF0C\u5E94\u6539\u4E3A\u5355\u5F15\u53F7`);let c=s.match(/const slides = \[([\s\S]*?)\n  \];/);if(!c)n.push("\u274C slides \u6570\u7EC4\u7F3A\u5931");else{let f=[...c[1].matchAll(/text:\s*['"]([^'"]+)['"]/g)];for(let $ of f){let P=this.visualUnits($[1]);P>8&&n.push(`\u274C slide text \u8D85\u8FC78\u89C6\u89C9\u5355\u4F4D: "${$[1]}" (${P}\u5355\u4F4D)`)}let h=/[，。！？、；：""''…—·,.\!\?;\:\"'\-\(\)\[\]【】《》]/,x=c[1].matchAll(/text:\s*['"]([^'"]+)['"]/g);for(let $ of x)h.test($[1])&&n.push(`\u274C slide text \u542B\u6807\u70B9: "${$[1]}"`);let b=(c[1].match(/\{start:/g)||[]).length;b<5&&n.push(`\u26A0\uFE0F slides \u53EA\u6709 ${b} \u5C4F\uFF0C\u53EF\u80FD\u592A\u5C11`);let v=[...c[1].matchAll(/text:\s*['"]([^'"]+)['"]/g)].map($=>$[1]);for(let $=0;$<v.length-1;$++){let P=v[$],k=v[$+1];/[a-zA-Z]$/.test(P)&&/^[a-z]/.test(k)&&n.push(`\u274C \u82F1\u6587\u5355\u8BCD\u88AB\u62C6\u65AD: "${P}" + "${k}"`)}[...c[1].matchAll(/\{start:[\s\S]*?lines:\s*\[([\s\S]*?)\]\s*\}/g)].forEach(($,P)=>{let k=[...$[1].matchAll(/size:\s*(\d+)/g)].map(D=>parseInt(D[1]));if(k.length>1){let D=Math.max(...k)-Math.min(...k);D>40&&n.push(`\u26A0\uFE0F \u5C4F\u5E55${P+1} size\u5DEE\u8DDD ${D}px\uFF08\u6700\u5927${Math.max(...k)} \u6700\u5C0F${Math.min(...k)}\uFF09`)}});for(let $ of v)!/[a-zA-Z0-9]/.test($)&&this.visualUnits($)>8&&n.push(`\u274C slide text \u7591\u4F3C\u5B8C\u6574\u53E5\u5B50: "${$}" (${this.visualUnits($)}\u5355\u4F4D)`);let F=s.match(/const subtitles = \[([\s\S]*?)\n  \];/);if(F){let $=[...F[1].matchAll(/text:\s*"([^"]+)"/g)].map(D=>D[1]),P=0;for(let D of v)D.length>=4&&$.some(W=>W.includes(D))&&P++;let k=v.length>0?P/v.length:0;k>.6&&n.push(`\u26A0\uFE0F slides \u4E0E\u5B57\u5E55\u91CD\u590D\u7387 ${(k*100).toFixed(0)}%\uFF08${P}/${v.length}\uFF09\uFF0CPPT\u5927\u5B57\u5EFA\u8BAE\u63D0\u70BC\u5173\u952E\u8BCD`)}}let a=s.match(/const slides = \[([\s\S]*?)\n  \];/);if(a){let f=[...a[1].matchAll(/\{start:\s*([\d.]+)[\s\S]*?end:\s*([\d.]+)/g)].map(h=>({start:parseFloat(h[1]),end:parseFloat(h[2])}));for(let h=0;h<f.length;h++)if(f[h].start>=f[h].end&&n.push(`\u274C slide ${h+1} \u65F6\u95F4\u5F02\u5E38: start(${f[h].start}) >= end(${f[h].end})`),h>0){f[h].start<f[h-1].end-.1&&n.push(`\u26A0\uFE0F slide ${h}\u2192${h+1} \u65F6\u95F4\u91CD\u53E0: \u524Dend=${f[h-1].end} \u540Estart=${f[h].start}`);let x=f[h].start-f[h-1].end;x>3&&n.push(`\u26A0\uFE0F slide ${h}\u2192${h+1} \u65F6\u95F4\u95F4\u9699 ${x.toFixed(1)}\u79D2`)}}s.includes(`const audioFile = '${t}'`)||n.push(`\u274C audioFile \u4E0D\u5339\u914D\uFF0C\u671F\u671B '${t}'`),e?s.includes(`const bgmFile = '${e}'`)||n.push(`\u274C bgmFile \u4E0D\u5339\u914D\uFF0C\u671F\u671B '${e}'`):s.includes("const bgmFile = null")||n.push("\u26A0\uFE0F bgmFile \u5E94\u4E3A null \u4F46\u4E0D\u662F");let d=s.match(/const subtitles = \[([\s\S]*?)\n  \];/);if(!d)n.push("\u274C subtitles \u6570\u7EC4\u7F3A\u5931");else{let f=(d[1].match(/\{start:/g)||[]).length;f<5&&n.push(`\u26A0\uFE0F subtitles \u53EA\u6709 ${f} \u6761\uFF0C\u53EF\u80FD\u592A\u5C11`);let h=[...d[1].matchAll(/\{start:\s*([\d.]+),\s*end:\s*([\d.]+)/g)].map(v=>({start:parseFloat(v[1]),end:parseFloat(v[2])})),x=0,b=0;for(let v=1;v<h.length;v++)h[v].start<h[v-1].end-.05&&x++,h[v].start-h[v-1].end>2&&b++;x>3&&n.push(`\u26A0\uFE0F subtitles \u6709 ${x} \u5904\u65F6\u95F4\u91CD\u53E0`),b>3&&n.push(`\u26A0\uFE0F subtitles \u6709 ${b} \u5904\u65F6\u95F4\u95F4\u9699>2\u79D2`)}r&&!s.includes("const videoTitle =")&&n.push("\u274C videoTitle \u7F3A\u5931");let g=this.settings.defaultStyle;s.includes(`const fontFamily = '${g.fontFamily}'`)||n.push(`\u274C fontFamily \u4E0D\u662F ${g.fontFamily}`),s.includes(`const bgmVolume = ${(u=g.bgmVolume)!=null?u:.3}`)||n.push(`\u274C bgmVolume \u4E0D\u662F ${(y=g.bgmVolume)!=null?y:.3}`),s.includes(`backgroundColor: '${g.bgColor}'`)||n.push(`\u274C backgroundColor \u4E0D\u662F ${g.bgColor}`),s.includes("topTitle")&&!s.includes("rgba(30, 40, 60, 0.35)")&&n.push("\u274C \u6807\u9898\u80CC\u666F\u900F\u660E\u5EA6\u4E0D\u662F 0.35"),s.includes("rgba(255,255,255,0.08)")||n.push("\u274C \u683C\u5B50\u80CC\u666F\u900F\u660E\u5EA6\u4E0D\u662F 0.08"),s.includes(`background: '${g.subtitleBgColor}'`)||n.push(`\u26A0\uFE0F \u5B57\u5E55\u80CC\u666F\u8272\u4E0D\u662F ${g.subtitleBgColor}`),s.includes("<Audio src={staticFile(audioFile)}")||n.push("\u274C Audio \u7EC4\u4EF6\u7F3A\u5931"),s.includes("from 'remotion'")||n.push("\u274C remotion import \u7F3A\u5931"),s.includes("AlibabaPuHuiTi-3-45-Light.ttf")||n.push("\u274C \u5B57\u4F53\u6587\u4EF6 Light \u52A0\u8F7D\u7F3A\u5931"),s.includes("AlibabaPuHuiTi-3-55-Regular.ttf")||n.push("\u274C \u5B57\u4F53\u6587\u4EF6 Regular \u52A0\u8F7D\u7F3A\u5931"),(!s.includes("PPT \u5173\u952E\u8BCD\u533A\u57DF")||!s.includes("top: topTitle ? 420 : 0,"))&&n.push("\u26A0\uFE0F PPT\u5173\u952E\u8BCD\u533A\u57DF\u672A\u4F7F\u7528absolute\u5B9A\u4F4D\u5BF9\u9F50");let p=s.match(/const images = \[([\s\S]*?)\n  \];/);if(p){let f=[...p[1].matchAll(/\{fileName:\s*"([^"]+)",\s*start:\s*([\d.]+),\s*end:\s*([\d.]+)\}/g)];for(let h=0;h<f.length;h++)for(let x=h+1;x<f.length;x++){let b=parseFloat(f[h][2]),v=parseFloat(f[h][3]),C=parseFloat(f[x][2]),F=parseFloat(f[x][3]);b<F&&C<v&&n.push(`\u26A0\uFE0F \u56FE\u7247\u65F6\u95F4\u91CD\u53E0: "${f[h][1]}" (${b}-${v}) \u4E0E "${f[x][1]}" (${C}-${F})`)}}let m=s.match(/const videos = \[([\s\S]*?)\n  \];/);if(m){let f=[...m[1].matchAll(/\{fileName:\s*"([^"]+)",\s*start:\s*([\d.]+),\s*end:\s*([\d.]+)\}/g)];for(let h=0;h<f.length;h++)for(let x=h+1;x<f.length;x++){let b=parseFloat(f[h][2]),v=parseFloat(f[h][3]),C=parseFloat(f[x][2]),F=parseFloat(f[x][3]);b<F&&C<v&&n.push(`\u26A0\uFE0F \u89C6\u9891\u65F6\u95F4\u91CD\u53E0: "${f[h][1]}" \u4E0E "${f[x][1]}"`)}}let l=s.match(/const subtitles = \[([\s\S]*?)\n  \];/);if(p&&l){let f=[...l[1].matchAll(/\{start:\s*([\d.]+),\s*end:\s*([\d.]+),\s*text:\s*"([^"]+)"\}/g)],h=[...p[1].matchAll(/\{fileName:\s*"([^"]+)",\s*start:\s*([\d.]+),\s*end:\s*([\d.]+)\}/g)];for(let x of h){let b=parseFloat(x[2]),v=1/0,C="";for(let F of f){let $=parseFloat(F[1]),P=parseFloat(F[2]),k=Math.min(Math.abs(b-$),Math.abs(b-P));k<v&&(v=k,C=F[3])}v>3&&n.push(`\u26A0\uFE0F \u56FE\u7247 "${x[1]}" (${b}s) \u8DDD\u6700\u8FD1\u5B57\u5E55 "${C}" \u8D85\u8FC73\u79D2\uFF0C\u53EF\u80FD\u5BF9\u4E0D\u4E0A`)}}return n}alignScriptWithChunks(s,t){if(!t||t.length===0)return[];let e=s.replace(/\n+/g,"").split(/(?<=[。！？；!?;])/).map(p=>p.trim()).filter(p=>p.length>0),r=[];for(let p of e)if(p.length>20){let m=p.split(/(?<=[，,、])/).map(l=>l.trim()).filter(l=>l.length>0);r.push(...m)}else r.push(p);let o=[];for(let p of t){let m=p.text.trim();if(m.length!==0)for(let l=0;l<m.length;l++){let u=p.timestamp[0]+(p.timestamp[1]-p.timestamp[0])*(l/m.length),y=p.timestamp[0]+(p.timestamp[1]-p.timestamp[0])*((l+1)/m.length);o.push({char:m[l],start:u,end:y})}}if(o.length===0)return[];let n=[];for(let p=0;p<o.length;p++){let m=o[p].char;/[。！？；!?;，,、：:""''「」\s\u3000]/.test(m)||n.push({char:m,idx:p})}let i=0,c=o[o.length-1].end,a=[];for(let p of r){let m=p.replace(/[。！？；!?;，,、：:""''「」\s\u3000]/g,"");if(m.length===0)continue;let l=-1,u=0,y=Math.min(i+200,n.length-m.length+1);for(let f=i;f<y;f++){let h=0;for(let x=0;x<m.length&&f+x<n.length;x++)n[f+x].char===m[x]&&h++;if(h>u&&h>=m.length*.6&&(u=h,l=f),h===m.length)break}if(l>=0){let f=n[l].idx,h=n[Math.min(l+m.length-1,n.length-1)].idx;a.push({text:p,start:o[f].start,end:o[h].end,matched:!0}),i=l+m.length}else a.push({text:p,start:-1,end:-1,matched:!1})}for(let p=0;p<a.length;p++){if(a[p].matched)continue;let m=0;for(let y=p-1;y>=0;y--)if(a[y].matched||a[y].start>=0){m=a[y].end;break}let l=c,u=0;for(let y=p;y<a.length;y++){if(a[y].matched){l=a[y].start;break}u++}if(u>0){let f=(l-m)/u,h=m;for(let x=p;x<a.length&&!a[x].matched;x++)a[x].start=h,a[x].end=h+f,h+=f}}let d=.5,g=-1;for(let p=0;p<=a.length;p++){let m=p<a.length&&a[p].end-a[p].start<d;if(m&&g<0)g=p;else if(!m&&g>=0){if(p-g>=3){let l=a[g].start,u=a.slice(g,p).reduce((v,C)=>v+C.text.replace(/[^\u4e00-\u9fff\w]/g,"").length,0),y=Math.max(u*.2,(p-g)*1),f=p<a.length&&a[p].start>l+y*.5?Math.min(a[p].start,l+y):l+y,h=a.slice(g,p).map(v=>Math.max(v.text.replace(/[^\u4e00-\u9fff\w]/g,"").length,1)),x=h.reduce((v,C)=>v+C,0),b=l;for(let v=g;v<p;v++){let C=h[v-g]/x*(f-l);a[v].start=b,a[v].end=b+C,b+=C}console.log(`[alignScript] \u4FEE\u590D\u5F02\u5E38\u5BC6\u96C6\u5B57\u5E55: \u7B2C${g+1}-${p}\u6761, ${l.toFixed(1)}s-${f.toFixed(1)}s`)}g=-1}}for(let p=1;p<a.length;p++)a[p].start<a[p-1].end&&(a[p].start=a[p-1].end),a[p].end<=a[p].start&&(a[p].end=a[p].start+.3);for(let p of a)p.end>c&&(p.end=c),p.start>c&&(p.start=c-.1);return a.map((p,m)=>({id:m+1,start:parseFloat(p.start.toFixed(3)),end:parseFloat(p.end.toFixed(3)),text:p.text}))}splitSegmentsToShortLines(s){let t=[],e=0;for(let r of s){let o=r.text.split(/[，。！？、；：,.\!\?\;\:\n…]+/).map(a=>a.trim()).filter(a=>a.length>0);if(o.length<=1){t.push({id:e,start:r.start,end:r.end,text:r.text.replace(/[，。！？、；：,.\!\?\;\:…""''「」【】《》\(\)（）\[\]\*#_~`]/g,"")}),e++;continue}let n=o.reduce((a,d)=>a+d.length,0),i=r.end-r.start,c=r.start;for(let a of o){let d=a.length/n*i,g=a.replace(/[，。！？、；：,.\!\?\;\:…""''「」【】《》\(\)（）\[\]\*#_~`]/g,"");g.length>0&&(t.push({id:e,start:c,end:c+d,text:g}),e++),c+=d}}return t}segmentsToSRT(s){return this.splitSegmentsToShortLines(s).map(e=>{let r=o=>{let n=Math.floor(o/3600),i=Math.floor(o%3600/60),c=Math.floor(o%60),a=Math.round(o%1*1e3);return`${String(n).padStart(2,"0")}:${String(i).padStart(2,"0")}:${String(c).padStart(2,"0")},${String(a).padStart(3,"0")}`};return`${e.id}
${r(e.start)} --> ${r(e.end)}
${e.text}`}).join(`

`)}parseSRT(s){let t=[],e=s.trim().split(/\n\s*\n/);for(let r of e){let o=r.trim().split(`
`);if(o.length<3)continue;let n=parseInt(o[0],10),i=o[1].match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);if(!i)continue;let c=parseInt(i[1])*3600+parseInt(i[2])*60+parseInt(i[3])+parseInt(i[4])/1e3,a=parseInt(i[5])*3600+parseInt(i[6])*60+parseInt(i[7])+parseInt(i[8])/1e3,d=o.slice(2).join(" ").trim();d&&t.push({index:n,start:c,end:a,text:d})}return t}classifyText(s){let t=s.length,e=/\d/.test(s),r=/[？?]/.test(s);return t<=6?{type:"gradient",size:88}:e?{type:"gradient",size:88}:r?{type:"accent",size:72}:t<=10?{type:"accent",size:72}:t<=16?{type:"normal",size:64}:{type:"normal",size:56}}mergeToSlides(s){let t=[],o=[],n=()=>{if(o.length===0)return;let i=o[0].start,c=o[o.length-1].end,a=o.map((d,g)=>{let p=d.text.replace(/\u201c/g,"\u300C").replace(/\u201d/g,"\u300D"),m=this.classifyText(p),l=m.type,u=m.size;if(o.length>=2){let y=o.map(b=>b.text.length),f=Math.max(...y),h=d.text.length===f,x=d.text.length<=6;h&&d.text.length>=4?(l="hero",u=Math.min(120,Math.max(88,Math.round(1200/d.text.length)))):x&&(l="sub",u=48)}return{text:p,type:l,size:u,delay:parseFloat((g*.12).toFixed(2))}});t.push({start:i,end:c,lines:a}),o=[]};for(let i of s){let c=o.length>0?i.end-o[0].start:0;(o.length>=3||c>4.5)&&n(),o.push(i)}return n(),t}generateRootJSX(s){let t=this.settings.fps||30,e=Math.ceil((s+1)*t),r=this.settings.videoWidth||1920,o=this.settings.videoHeight||1080;return`import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld.jsx";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={${e}}
        fps={${t}}
        width={${r}}
        height={${o}}
      />
    </>
  );
};
`}};var fe=require("obsidian"),ye=class{constructor(s,t){this.app=s,this.settings=t}updateSettings(s){this.settings=s}async generate(s,t){var g;let e=s,r=t,o=this.settings;if(!o.coverBgImagePath)throw new Error("\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u914D\u7F6E\u5C01\u9762\u5E95\u56FE\u8DEF\u5F84\uFF08\u6587\u4EF6\u6216\u6587\u4EF6\u5939\uFF09");let n,i=this.app.vault.getAbstractFileByPath(o.coverBgImagePath);if(i instanceof fe.TFile)n=i;else if(i&&"children"in i){let p=["png","jpg","jpeg","webp"],m=i.children.filter(l=>l instanceof fe.TFile&&p.includes(l.extension.toLowerCase()));if(m.length===0)throw new Error(`\u6587\u4EF6\u5939 ${o.coverBgImagePath} \u4E2D\u6CA1\u6709\u56FE\u7247\u6587\u4EF6\uFF08\u652F\u6301 png/jpg/webp\uFF09`);n=m[Math.floor(Math.random()*m.length)],console.log(`[\u5C01\u9762] \u4ECE ${m.length} \u5F20\u5E95\u56FE\u4E2D\u968F\u673A\u9009\u53D6: ${n.path}`)}else throw new Error(`\u5E95\u56FE\u8DEF\u5F84\u4E0D\u5B58\u5728: ${o.coverBgImagePath}`);let c=await this.app.vault.readBinary(n),a=new Blob([c],{type:this.getMimeType(n.extension)}),d=URL.createObjectURL(a);try{let p=await this.loadImage(d),m=o.coverWidth||1080,l=o.coverHeight||1920,u=document.createElement("canvas");u.width=m,u.height=l;let y=u.getContext("2d");this.drawCover(y,p,m,l);let f=(g=o.coverOverlayOpacity)!=null?g:.96;y.fillStyle=`rgba(0, 0, 0, ${f})`,y.fillRect(0,0,m,l),this.drawText(y,m,l,e,r);let x=await(await this.canvasToBlob(u)).arrayBuffer(),b=o.coverOutputDir||"VideoForge/covers";await this.ensureDir(b);let v=new Date().toISOString().slice(0,10),C=e.slice(0,20).replace(/[\\/:*?"<>|]/g,"_"),F=`${b}/\u5C01\u9762-${C}-${v}.png`,$=this.app.vault.getAbstractFileByPath(F);return $ instanceof fe.TFile?await this.app.vault.modifyBinary($,x):await this.app.vault.createBinary(F,x),F}finally{URL.revokeObjectURL(d)}}parseSegments(s){let t=[],e=/\*\*(.+?)\*\*/g,r=0,o;for(;(o=e.exec(s))!==null;)o.index>r&&t.push({text:s.slice(r,o.index),bold:!1}),t.push({text:o[1],bold:!0}),r=e.lastIndex;return r<s.length&&t.push({text:s.slice(r),bold:!1}),t.length>0?t:[{text:s,bold:!1}]}plainText(s){return s.replace(/\*\*(.+?)\*\*/g,"$1")}measureMixedLine(s,t,e,r){let o=0;for(let n of t)s.font=`${n.bold?900:300} ${e}px ${r}`,o+=s.measureText(n.text).width;return o}drawMixedLine(s,t,e,r,o,n,i){let c=this.measureMixedLine(s,t,o,n),a=e-c/2;for(let d of t)s.font=`${d.bold?900:300} ${o}px ${n}`,s.fillStyle=i,s.globalAlpha=d.bold?1:.72,s.textAlign="left",s.textBaseline="top",s.fillText(d.text,a,r),a+=s.measureText(d.text).width;s.globalAlpha=1}drawText(s,t,e,r,o){let n=this.settings,i=n.coverFontColor||"#FFFFFF",c=n.coverFontFamily||"AlibabaPuHuiTi, PingFang SC, Microsoft YaHei, sans-serif",a=t*.06,d=t-a*2,g=[r];o&&o.trim()&&g.push(o);let p=this.calcMaxFontSize(s,c,r,o,d,e);s.shadowColor="rgba(0, 0, 0, 0.8)",s.shadowBlur=12,s.shadowOffsetX=2,s.shadowOffsetY=2;let m=1.3,l=g.length>1?p*.3:0,u=g.length*p*m+l,y=(e-u)/2,f=t/2;g.forEach((h,x)=>{let b=this.parseSegments(h),v=y+x*(p*m+(x>0?l:0));this.drawMixedLine(s,b,f,v,p,c,i)}),s.shadowColor="transparent",s.shadowBlur=0,s.shadowOffsetX=0,s.shadowOffsetY=0}calcMaxFontSize(s,t,e,r,o,n){let c=n*.8,a=[e];r&&r.trim()&&a.push(r);for(let d=300;d>=40;d-=2){let g=!0;for(let l of a){let u=this.parseSegments(l);if(this.measureMixedLine(s,u,d,t)>o){g=!1;break}}if(!g)continue;let p=a.length>1?d*.3:0;if(a.length*d*1.3+p<=c)return d}return 40}wrapText(s,t,e){let r=[],o="";for(let n of t){let i=o+n;s.measureText(i).width>e&&o.length>0?(r.push(o),o=n):o=i}return o&&r.push(o),r}drawCover(s,t,e,r){let o=t.width/t.height,n=e/r,i=0,c=0,a=t.width,d=t.height;o>n?(a=t.height*n,i=(t.width-a)/2):(d=t.width/n,c=(t.height-d)/2),s.drawImage(t,i,c,a,d,0,0,e,r)}loadImage(s){return new Promise((t,e)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>e(new Error("\u5E95\u56FE\u52A0\u8F7D\u5931\u8D25")),r.src=s})}canvasToBlob(s){return new Promise((t,e)=>{s.toBlob(r=>r?t(r):e(new Error("Canvas \u5BFC\u51FA\u5931\u8D25")),"image/png")})}async ensureDir(s){let t=this.app.vault.adapter,e=s.split("/"),r="";for(let o of e)r=r?`${r}/${o}`:o,await t.exists(r)||await t.mkdir(r)}getMimeType(s){return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif"}[s.toLowerCase()]||"image/png"}};var w=require("obsidian");var be=class extends w.PluginSettingTab{constructor(t,e){super(t,e);this.plugin=e}display(){let{containerEl:t}=this;t.empty(),t.createEl("div",{cls:"vf-settings-header"},n=>{n.createEl("h1",{text:"\u{1F3AC} Video Forge \u89C6\u9891\u953B\u9020"}),n.createEl("p",{text:"AI \u9A71\u52A8\u7684\u89C6\u9891\u751F\u4EA7\u7EBF\uFF1A\u811A\u672C \u2192 \u573A\u666F \u2192 \u8BED\u97F3 \u2192 \u5B57\u5E55 \u2192 \u89C6\u9891",cls:"setting-item-description"})}),t.createEl("h2",{text:"\u{1F4CC} \u57FA\u7840\u8BBE\u7F6E"}),t.createEl("p",{text:"\u586B\u5B8C\u4EE5\u4E0B 4 \u9879\u5C31\u80FD\u5F00\u59CB\u751F\u6210\u89C6\u9891",cls:"setting-item-description"}),new w.Setting(t).setName("AI \u6A21\u578B").setDesc("\u63A8\u8350 Claude Sonnet 4\uFF0C\u6548\u679C\u6700\u597D").addDropdown(n=>n.addOptions({"claude-sonnet-4-6":"Claude Sonnet 4\uFF08\u63A8\u8350\uFF09","claude-opus-4-6":"Claude Opus 4\uFF08\u6700\u5F3A\uFF09","gemini-2.5-flash":"Gemini 2.5 Flash\uFF08\u514D\u8D39\uFF09","gemini-2.5-pro":"Gemini 2.5 Pro","gemini-3-flash-preview":"Gemini 3 Flash","gemini-3-pro-preview":"Gemini 3 Pro","gemini-3.1-pro-preview":"Gemini 3.1 Pro"}).setValue(this.plugin.settings.geminiModel).onChange(async i=>{this.plugin.settings.geminiModel=i,await this.plugin.saveSettings(),this.display()})),this.plugin.settings.geminiModel.includes("claude")?(new w.Setting(t).setName("Claude API Key").setDesc("\u5728 openclaw-api.com \u6216\u5176\u4ED6 Claude \u4EE3\u7406\u83B7\u53D6").addText(n=>n.setPlaceholder("sk-...").setValue(this.plugin.settings.claudeApiKey).onChange(async i=>{this.plugin.settings.claudeApiKey=i.trim(),await this.plugin.saveSettings()})),new w.Setting(t).setName("Claude \u4EE3\u7406\u5730\u5740").addText(n=>n.setPlaceholder("https://openclaw-api.com/v1").setValue(this.plugin.settings.claudeBaseUrl).onChange(async i=>{this.plugin.settings.claudeBaseUrl=i.trim()||"https://openclaw-api.com/v1",await this.plugin.saveSettings()}))):new w.Setting(t).setName("Gemini API Key").setDesc("\u5728 Google AI Studio \u83B7\u53D6").addText(n=>n.setPlaceholder("AIza...").setValue(this.plugin.settings.geminiApiKey).onChange(async i=>{this.plugin.settings.geminiApiKey=i.trim(),await this.plugin.saveSettings()})),new w.Setting(t).setName("TTS \u5F15\u64CE").setDesc("\u8BED\u97F3\u5408\u6210\u670D\u52A1").addDropdown(n=>n.addOptions({"fish-audio":"Fish Audio S1\uFF08\u63A8\u8350\uFF09",minimax:"MiniMax\uFF08\u58F0\u97F3\u514B\u9686\uFF09"}).setValue(this.plugin.settings.ttsEngine).onChange(async i=>{this.plugin.settings.ttsEngine=i,await this.plugin.saveSettings(),this.display()})),this.plugin.settings.ttsEngine==="fish-audio"&&(new w.Setting(t).setName("Fish Audio API Key").setDesc("\u5728 fish.audio \u6CE8\u518C\u83B7\u53D6").addText(n=>n.setPlaceholder("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx").setValue(this.plugin.settings.fishAudioApiKey).onChange(async i=>{this.plugin.settings.fishAudioApiKey=i.trim(),await this.plugin.saveSettings()})),new w.Setting(t).setName("Fish Audio \u97F3\u8272 ID").setDesc("\u514B\u9686\u97F3\u8272\u7684 Model ID\uFF0C\u5728 fish.audio/zh-CN/my \u67E5\u770B").addText(n=>n.setPlaceholder("46f233e55e10...").setValue(this.plugin.settings.defaultVoiceId).onChange(async i=>{this.plugin.settings.defaultVoiceId=i.trim(),await this.plugin.saveSettings()}))),this.plugin.settings.ttsEngine==="minimax"&&(new w.Setting(t).setName("MiniMax API Key").setDesc("\u5728 platform.minimaxi.com \u83B7\u53D6").addText(n=>n.setPlaceholder("eyJhbGciOi...").setValue(this.plugin.settings.minimaxApiKey).onChange(async i=>{this.plugin.settings.minimaxApiKey=i.trim(),await this.plugin.saveSettings()})),new w.Setting(t).setName("MiniMax Group ID").setDesc("\u5728 MiniMax \u63A7\u5236\u53F0\u8D26\u6237\u4FE1\u606F\u4E2D\u67E5\u770B").addText(n=>n.setPlaceholder("17xxxxxxxx").setValue(this.plugin.settings.minimaxGroupId).onChange(async i=>{this.plugin.settings.minimaxGroupId=i.trim(),await this.plugin.saveSettings()})),new w.Setting(t).setName("MiniMax \u97F3\u8272 ID").setDesc("\u514B\u9686\u97F3\u8272ID\u6216\u5185\u7F6E\u97F3\u8272\uFF0C\u5982 male-qn-qingse").addText(n=>n.setPlaceholder("male-qn-qingse").setValue(this.plugin.settings.minimaxVoiceId).onChange(async i=>{this.plugin.settings.minimaxVoiceId=i.trim(),await this.plugin.saveSettings()})),new w.Setting(t).setName("\u{1F399}\uFE0F \u58F0\u97F3\u514B\u9686").setDesc("\u4E0A\u4F20 10-30 \u79D2\u5F55\u97F3\uFF0C\u4E00\u952E\u514B\u9686\u4F60\u7684\u58F0\u97F3\uFF08\u652F\u6301 MP3 / WAV\uFF0C\u4E0D\u8D85\u8FC7 20MB\uFF09").addButton(n=>n.setButtonText("\u9009\u62E9\u97F3\u9891\u5E76\u514B\u9686").setCta().onClick(async()=>{if(!this.plugin.settings.minimaxApiKey||!this.plugin.settings.minimaxGroupId){new w.Notice("\u274C \u8BF7\u5148\u586B\u5199 MiniMax API Key \u548C Group ID");return}let i=document.createElement("input");i.type="file",i.accept=".wav,.mp3,.m4a,.ogg,.flac,audio/*",i.onchange=async()=>{var g;let c=(g=i.files)==null?void 0:g[0];if(!c)return;let a=await new Promise(p=>{let m=new w.Modal(this.app);m.titleEl.setText("\u{1F399}\uFE0F \u8F93\u5165\u97F3\u8272\u540D\u79F0");let l="",u=!1;new w.Setting(m.contentEl).setName("\u97F3\u8272\u540D\u79F0").setDesc("\u7ED9\u4F60\u7684\u58F0\u97F3\u8D77\u4E2A\u540D\u5B57\uFF0C\u5982\u300C\u6211\u7684\u58F0\u97F3\u300D").addText(y=>y.setPlaceholder("\u6211\u7684\u58F0\u97F3").onChange(f=>{l=f.trim()})),new w.Setting(m.contentEl).addButton(y=>y.setButtonText("\u5F00\u59CB\u514B\u9686").setCta().onClick(()=>{u=!0,m.close(),p(l||"\u6211\u7684\u58F0\u97F3")})).addButton(y=>y.setButtonText("\u53D6\u6D88").onClick(()=>{u=!0,m.close(),p(null)})),m.onClose=()=>{u||p(null)},m.open()});if(!a)return;let d=c.size/1024/1024;if(d>20){new w.Notice(`\u274C \u6587\u4EF6\u592A\u5927\uFF08${d.toFixed(1)}MB\uFF09\uFF0CMiniMax \u9650\u5236 20MB\u3002\u5EFA\u8BAE\u7528 MP3 \u683C\u5F0F\u5F55\u5236\uFF0C\u6216\u7F29\u77ED\u5F55\u97F3\u65F6\u957F\u3002`);return}n.setButtonText("\u514B\u9686\u4E2D..."),n.setDisabled(!0);try{let p=await c.arrayBuffer(),l=await new ee(this.plugin.settings.minimaxApiKey,this.plugin.settings.minimaxGroupId).cloneVoice(p,a,c.name);this.plugin.settings.minimaxVoiceId=l,await this.plugin.saveSettings(),new w.Notice(`\u2705 \u58F0\u97F3\u514B\u9686\u6210\u529F\uFF01\u97F3\u8272 ID: ${l}`),this.display()}catch(p){new w.Notice(`\u274C ${p.message}`),n.setButtonText("\u9009\u62E9\u97F3\u9891\u5E76\u514B\u9686"),n.setDisabled(!1)}},i.click()})));let e=t.createEl("details");e.createEl("summary",{text:"\u2699\uFE0F \u9AD8\u7EA7\u8BBE\u7F6E\uFF08\u70B9\u51FB\u5C55\u5F00\uFF09",cls:"setting-item-heading"}),e.querySelector("summary").setAttribute("style","cursor: pointer; padding: 12px 0; font-size: 1.1em; font-weight: 600; color: var(--text-muted); border-top: 1px solid var(--background-modifier-border); margin-top: 16px;"),this.plugin.settings.geminiModel.includes("claude")&&(e.createEl("h3",{text:"\u{1F9E0} Gemini \u5907\u7528\uFF08Claude \u5931\u8D25\u65F6\u964D\u7EA7\uFF09"}),new w.Setting(e).setName("Gemini API Key").setDesc("\u53EF\u9009\uFF0CClaude \u5931\u8D25\u65F6\u81EA\u52A8\u5207\u6362\u5230 Gemini").addText(n=>n.setPlaceholder("AIza...").setValue(this.plugin.settings.geminiApiKey).onChange(async i=>{this.plugin.settings.geminiApiKey=i.trim(),await this.plugin.saveSettings()})),new w.Setting(e).setName("Gemini Base URL").setDesc("\u7B2C\u4E09\u65B9\u4E2D\u8F6C\u5730\u5740\uFF0C\u5B98\u65B9\u7559\u7A7A\u3002\u586B https://xxx.com \u6216 https://xxx.com/v1beta/models \u90FD\u884C\uFF0C\u63D2\u4EF6\u81EA\u52A8\u8BC6\u522B").addText(n=>n.setPlaceholder("https://generativelanguage.googleapis.com/v1beta").setValue(this.plugin.settings.geminiBaseUrl).onChange(async i=>{this.plugin.settings.geminiBaseUrl=i.trim()||"https://generativelanguage.googleapis.com/v1beta",await this.plugin.saveSettings()})));let r=e;r.createEl("h2",{text:"\u{1F4DD} \u8BED\u97F3\u8F6C\u5B57\u5E55 (STT)"}),new w.Setting(r).setName("STT \u5F15\u64CE").setDesc("\u672C\u5730Whisper\u6700\u7CBE\u51C6\u514D\u8D39\uFF1Bfal.ai\u4ED8\u8D39\u5907\u7528").addDropdown(n=>n.addOptions({local:"\u672C\u5730 Whisper\uFF08\u63A8\u8350\xB7\u514D\u8D39\xB7GPU\u52A0\u901F\uFF09",fal:"fal.ai Whisper\uFF08\u4ED8\u8D39\uFF09"}).setValue(this.plugin.settings.whisperEngine||"local").onChange(async i=>{this.plugin.settings.whisperEngine=i,await this.plugin.saveSettings(),this.display()})),this.plugin.settings.whisperEngine==="local"?new w.Setting(r).setName("\u672C\u5730 Whisper \u670D\u52A1\u5730\u5740").setDesc("\u8FD0\u884C python VideoForge/whisper-server.py \u540E\u586B\u5165\u5730\u5740").addText(n=>n.setPlaceholder("http://localhost:5111").setValue(this.plugin.settings.localWhisperUrl||"http://localhost:5111").onChange(async i=>{this.plugin.settings.localWhisperUrl=i.trim()||"http://localhost:5111",await this.plugin.saveSettings()})):new w.Setting(r).setName("fal.ai API Key").setDesc("\u5728 fal.ai \u6CE8\u518C\u540E\u83B7\u53D6 API Key").addText(n=>n.setPlaceholder("your-fal-api-key...").setValue(this.plugin.settings.falApiKey).onChange(async i=>{this.plugin.settings.falApiKey=i.trim(),await this.plugin.saveSettings()})),r.createEl("h2",{text:"\u{1F3A5} Remotion (\u89C6\u9891\u6E32\u67D3)"}),new w.Setting(r).setName("Remotion \u9879\u76EE\u8DEF\u5F84").setDesc('Remotion \u9879\u76EE\u5728 Vault \u4E2D\u7684\u76F8\u5BF9\u8DEF\u5F84\uFF08\u70B9\u51FB"\u81EA\u52A8\u68C0\u6D4B"\u53EF\u81EA\u52A8\u67E5\u627E\uFF09').addText(n=>n.setPlaceholder("VideoForge/remotion-project").setValue(this.plugin.settings.remotionProjectPath).onChange(async i=>{this.plugin.settings.remotionProjectPath=i.trim(),await this.plugin.saveSettings()})).addButton(n=>n.setButtonText("\u81EA\u52A8\u68C0\u6D4B").onClick(async()=>{let i=this.plugin.app.vault.adapter,c=["VideoForge/remotion-project","remotion-project","remotion","video","VideoForge"],a="";for(let d of c)try{if((await i.read(`${d}/package.json`)).includes("remotion")){a=d;break}}catch(g){}if(!a)try{let d=await i.list("");for(let g of d.folders)if(!g.startsWith(".")){try{if((await i.read(`${g}/package.json`)).includes("remotion")){a=g;break}}catch(p){}try{let p=await i.list(g);for(let m of p.folders)try{if((await i.read(`${m}/package.json`)).includes("remotion")){a=m;break}}catch(l){}if(a)break}catch(p){}}}catch(d){}a?(this.plugin.settings.remotionProjectPath=a,await this.plugin.saveSettings(),new w.Notice(`\u2705 \u5DF2\u68C0\u6D4B\u5230 Remotion \u9879\u76EE: ${a}`),this.display()):new w.Notice("\u26A0\uFE0F \u672A\u627E\u5230 Remotion \u9879\u76EE\uFF0C\u8BF7\u624B\u52A8\u586B\u5199\u8DEF\u5F84")})),new w.Setting(r).setName("\u8F93\u51FA\u76EE\u5F55").setDesc("\u97F3\u9891\u3001\u6570\u636E\u7B49\u4E2D\u95F4\u6587\u4EF6\u7684\u8F93\u51FA\u76EE\u5F55").addText(n=>n.setPlaceholder("VideoForge/output").setValue(this.plugin.settings.outputDir).onChange(async i=>{this.plugin.settings.outputDir=i.trim(),await this.plugin.saveSettings()})),new w.Setting(r).setName("\u89C6\u9891\u5206\u8FA8\u7387").addDropdown(n=>n.addOptions({"1920x1080":"1080p (1920\xD71080)","1280x720":"720p (1280\xD7720)","1080x1920":"\u7AD6\u5C4F 1080p (1080\xD71920)","1080x1080":"\u65B9\u5F62 (1080\xD71080)"}).setValue(`${this.plugin.settings.videoWidth}x${this.plugin.settings.videoHeight}`).onChange(async i=>{let[c,a]=i.split("x").map(Number);this.plugin.settings.videoWidth=c,this.plugin.settings.videoHeight=a,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5E27\u7387 (FPS)").addDropdown(n=>n.addOptions({24:"24 FPS",30:"30 FPS",60:"60 FPS"}).setValue(String(this.plugin.settings.fps)).onChange(async i=>{this.plugin.settings.fps=Number(i),await this.plugin.saveSettings()})),new w.Setting(r).setName("\u89C6\u9891\u6E32\u67D3\u8F93\u51FA\u76EE\u5F55").setDesc("\u6E32\u67D3\u5B8C\u6210\u540E\u89C6\u9891\u4FDD\u5B58\u7684\u76EE\u5F55\uFF08\u7EDD\u5BF9\u8DEF\u5F84\uFF09\uFF0C\u7559\u7A7A\u5219\u53EA\u8F93\u51FA\u5230 Remotion \u9879\u76EE\u7684 out/ \u76EE\u5F55").addText(n=>n.setPlaceholder("D:\\2.\u6211\u7684\u53E3\u64AD\u89C6\u9891").setValue(this.plugin.settings.renderOutputDir).onChange(async i=>{this.plugin.settings.renderOutputDir=i.trim(),await this.plugin.saveSettings()})),new w.Setting(r).setName("Node.js \u5B89\u88C5\u8DEF\u5F84").setDesc("Node.js \u6240\u5728\u76EE\u5F55\u3002Windows \u586B\u542B npx.cmd \u7684\u76EE\u5F55\uFF0CMac \u586B\u542B npx \u7684\u76EE\u5F55\uFF08\u5982 /opt/homebrew/bin \u6216 /usr/local/bin\uFF09\u3002\u7559\u7A7A\u5219\u7528\u7CFB\u7EDF PATH").addText(n=>n.setPlaceholder("Win: C:\\Program Files\\nodejs  |  Mac: /opt/homebrew/bin").setValue(this.plugin.settings.nodejsPath).onChange(async i=>{this.plugin.settings.nodejsPath=i.trim(),await this.plugin.saveSettings()})),new w.Setting(r).setName("BGM \u6587\u4EF6\u5939\u8DEF\u5F84").setDesc("\u628A .mp3 \u6587\u4EF6\u653E\u8FDB\u8FD9\u4E2A\u6587\u4EF6\u5939\u5373\u53EF\uFF0C\u63D2\u4EF6\u81EA\u52A8\u968F\u673A\u9009\u53D6\u3002\u5982\u9700\u60C5\u7EEA\u5339\u914D\uFF0C\u5728\u6587\u4EF6\u5939\u5185\u653E\u4E00\u4E2A BGM\u7D22\u5F15.md").addText(n=>n.setPlaceholder("VideoForge/BGM").setValue(this.plugin.settings.bgmFolderPath).onChange(async i=>{this.plugin.settings.bgmFolderPath=i.trim(),await this.plugin.saveSettings()})),r.createEl("h2",{text:"\u{1F3A8} \u89C6\u9891\u98CE\u683C"});let o={"tech-blue":{label:"\u{1F535} \u79D1\u6280\u84DD",style:{accentColor:"#0A84FF",heroColor:"#FFFFFF",fontColor:"#E0E0E0",subColor:"#B0B0B0",bgColor:"#0A0A0A",gradientFrom:"#0A84FF",gradientTo:"#5E5CE6"}},"warm-orange":{label:"\u{1F7E0} \u6696\u5149\u6A59",style:{accentColor:"#FF9500",heroColor:"#FFFFFF",fontColor:"#F5F5F5",subColor:"#C0C0C0",bgColor:"#1A1000",gradientFrom:"#FF9500",gradientTo:"#FF2D55"}},"minimal-bw":{label:"\u26AA \u7B80\u7EA6\u9ED1\u767D",style:{accentColor:"#CCCCCC",heroColor:"#FFFFFF",fontColor:"#E0E0E0",subColor:"#999999",bgColor:"#000000",gradientFrom:"#FFFFFF",gradientTo:"#888888"}},"energy-red":{label:"\u{1F534} \u6D3B\u529B\u7EA2",style:{accentColor:"#FF3B30",heroColor:"#FFFFFF",fontColor:"#F0F0F0",subColor:"#B0B0B0",bgColor:"#0D0000",gradientFrom:"#FF3B30",gradientTo:"#FF9500"}},"nature-green":{label:"\u{1F7E2} \u81EA\u7136\u7EFF",style:{accentColor:"#30D158",heroColor:"#FFFFFF",fontColor:"#E8E8E8",subColor:"#A0A0A0",bgColor:"#001A00",gradientFrom:"#30D158",gradientTo:"#0A84FF"}},"midnight-blue":{label:"\u{1F319} \u5348\u591C\u84DD",style:{accentColor:"#5E5CE6",heroColor:"#FFFFFF",fontColor:"#D0D0E0",subColor:"#8888AA",bgColor:"#0A0A1A",gradientFrom:"#5E5CE6",gradientTo:"#0A84FF"}},"dark-purple":{label:"\u{1F7E3} \u6697\u591C\u7D2B",style:{accentColor:"#BF5AF2",heroColor:"#FFFFFF",fontColor:"#E0D8F0",subColor:"#9080B0",bgColor:"#0D0015",gradientFrom:"#BF5AF2",gradientTo:"#5E5CE6"}},"wine-red":{label:"\u{1F377} \u6DF1\u7EA2\u9152",style:{accentColor:"#A0304A",heroColor:"#FFF0F0",fontColor:"#E8D0D0",subColor:"#A08080",bgColor:"#120808",gradientFrom:"#A0304A",gradientTo:"#5A1020"}},"gold-luxury":{label:"\u2728 \u91D1\u8272\u5962\u534E",style:{accentColor:"#FFD700",heroColor:"#FFFFFF",fontColor:"#F0E8D0",subColor:"#B0A070",bgColor:"#0A0800",gradientFrom:"#FFD700",gradientTo:"#FF9500"}},"glacier-blue":{label:"\u{1F9CA} \u51B0\u5DDD\u84DD",style:{accentColor:"#64D2FF",heroColor:"#FFFFFF",fontColor:"#D0E8F0",subColor:"#80A8C0",bgColor:"#050D12",gradientFrom:"#64D2FF",gradientTo:"#0A84FF"}},"sakura-pink":{label:"\u{1F338} \u6A31\u82B1\u7C89",style:{accentColor:"#FF6B9D",heroColor:"#FFFFFF",fontColor:"#F0E0E8",subColor:"#B08898",bgColor:"#120810",gradientFrom:"#FF6B9D",gradientTo:"#BF5AF2"}},"mint-fresh":{label:"\u{1F343} \u8584\u8377\u7EFF",style:{accentColor:"#00C9A7",heroColor:"#FFFFFF",fontColor:"#D8F0E8",subColor:"#80B0A0",bgColor:"#001210",gradientFrom:"#00C9A7",gradientTo:"#30D158"}},"sunset-glow":{label:"\u{1F305} \u65E5\u843D\u6E10\u53D8",style:{accentColor:"#FF6347",heroColor:"#FFFFFF",fontColor:"#F0E0D0",subColor:"#C09070",bgColor:"#120800",gradientFrom:"#FF6347",gradientTo:"#FFD700"}},"starry-night":{label:"\u{1F30C} \u661F\u7A7A\u7D2B",style:{accentColor:"#7B68EE",heroColor:"#FFFFFF",fontColor:"#D8D0F0",subColor:"#8878B0",bgColor:"#08061A",gradientFrom:"#7B68EE",gradientTo:"#191970"}},"lemon-yellow":{label:"\u{1F34B} \u67E0\u6AAC\u9EC4",style:{accentColor:"#FFE135",heroColor:"#1A1A1A",fontColor:"#F0E8C0",subColor:"#B0A870",bgColor:"#0A0A00",gradientFrom:"#FFE135",gradientTo:"#FF9500"}},"coral-orange":{label:"\u{1FAB8} \u73CA\u745A\u6A59",style:{accentColor:"#FF7F50",heroColor:"#FFFFFF",fontColor:"#F0E0D8",subColor:"#B09080",bgColor:"#100A08",gradientFrom:"#FF7F50",gradientTo:"#FF6B9D"}},"deep-ocean":{label:"\u{1F30A} \u6DF1\u6D77\u84DD",style:{accentColor:"#006994",heroColor:"#FFFFFF",fontColor:"#C0D8E8",subColor:"#6090A8",bgColor:"#020A10",gradientFrom:"#006994",gradientTo:"#00CED1"}},"forest-green":{label:"\u{1F332} \u68EE\u6797\u7EFF",style:{accentColor:"#228B22",heroColor:"#FFFFFF",fontColor:"#D0E8D0",subColor:"#70A070",bgColor:"#040A04",gradientFrom:"#228B22",gradientTo:"#006400"}},"rose-gold":{label:"\u{1F339} \u73AB\u7470\u91D1",style:{accentColor:"#E8A090",heroColor:"#FFFFFF",fontColor:"#F0E0D8",subColor:"#B09888",bgColor:"#120A08",gradientFrom:"#E8A090",gradientTo:"#BF5AF2"}},aurora:{label:"\u{1F308} \u6781\u5149",style:{accentColor:"#00FF87",heroColor:"#FFFFFF",fontColor:"#D0F0E0",subColor:"#80C0A0",bgColor:"#050A08",gradientFrom:"#00FF87",gradientTo:"#60EFFF"}}};new w.Setting(r).setName("\u98CE\u683C\u9884\u8BBE").setDesc("\u4E00\u952E\u5207\u6362\u914D\u8272\u65B9\u6848\uFF0C\u4E5F\u53EF\u5728\u4E0B\u65B9\u81EA\u5B9A\u4E49").addDropdown(n=>{n.addOption("custom","\u270F\uFE0F \u81EA\u5B9A\u4E49");for(let[i,c]of Object.entries(o))n.addOption(i,c.label);return n.setValue("custom"),n.onChange(async i=>{i!=="custom"&&o[i]&&(Object.assign(this.plugin.settings.defaultStyle,o[i].style),await this.plugin.saveSettings(),this.display())}),n}),new w.Setting(r).setName("\u5B57\u5E55\u6837\u5F0F").addDropdown(n=>n.addOptions({"bottom-bar":"\u5E95\u90E8\u6A2A\u6761","center-pop":"\u5C45\u4E2D\u5F39\u51FA",typewriter:"\u6253\u5B57\u673A",karaoke:"\u5361\u62C9OK"}).setValue(this.plugin.settings.defaultStyle.subtitleStyle).onChange(async i=>{this.plugin.settings.defaultStyle.subtitleStyle=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u8F6C\u573A\u6548\u679C").addDropdown(n=>n.addOptions({crossfade:"\u6DE1\u5165\u6DE1\u51FA",slide:"\u6ED1\u52A8",zoom:"\u7F29\u653E",glitch:"\u6545\u969C\u98CE",none:"\u65E0"}).setValue(this.plugin.settings.defaultStyle.transition).onChange(async i=>{this.plugin.settings.defaultStyle.transition=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5F3A\u8C03\u8272 (accent)").setDesc("accent \u7C7B\u578B\u6587\u5B57\u989C\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.accentColor).onChange(async i=>{this.plugin.settings.defaultStyle.accentColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u80CC\u666F\u8272").setDesc("\u89C6\u9891\u80CC\u666F\u989C\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.bgColor).onChange(async i=>{this.plugin.settings.defaultStyle.bgColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u6B63\u6587\u8272 (normal)").setDesc("normal \u7C7B\u578B\u6587\u5B57\u989C\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.fontColor).onChange(async i=>{this.plugin.settings.defaultStyle.fontColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u6807\u9898\u8272 (hero)").setDesc("hero \u7C7B\u578B\u6587\u5B57\u989C\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.heroColor).onChange(async i=>{this.plugin.settings.defaultStyle.heroColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u8F85\u52A9\u8272 (sub)").setDesc("sub \u7C7B\u578B\u6587\u5B57\u989C\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.subColor).onChange(async i=>{this.plugin.settings.defaultStyle.subColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u6E10\u53D8\u8D77\u59CB\u8272").setDesc("gradient \u7C7B\u578B\u6587\u5B57\u6E10\u53D8\u8D77\u59CB\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.gradientFrom).onChange(async i=>{this.plugin.settings.defaultStyle.gradientFrom=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u6E10\u53D8\u7ED3\u675F\u8272").setDesc("gradient \u7C7B\u578B\u6587\u5B57\u6E10\u53D8\u7ED3\u675F\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.defaultStyle.gradientTo).onChange(async i=>{this.plugin.settings.defaultStyle.gradientTo=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("BGM \u97F3\u91CF").setDesc("\u80CC\u666F\u97F3\u4E50\u97F3\u91CF 0-1").addSlider(n=>n.setLimits(0,1,.05).setValue(this.plugin.settings.defaultStyle.bgmVolume).setDynamicTooltip().onChange(async i=>{this.plugin.settings.defaultStyle.bgmVolume=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5B57\u5E55\u5B57\u53F7").setDesc("\u5E95\u90E8\u5B57\u5E55\u7684\u5B57\u4F53\u5927\u5C0F").addText(n=>n.setValue(String(this.plugin.settings.defaultStyle.subtitleFontSize||46)).onChange(async i=>{this.plugin.settings.defaultStyle.subtitleFontSize=parseInt(i)||46,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5B57\u5E55\u80CC\u666F\u8272").setDesc("\u5E95\u90E8\u5B57\u5E55\u6761\u80CC\u666F\u8272\uFF08\u652F\u6301 rgba\uFF09").addText(n=>n.setValue(this.plugin.settings.defaultStyle.subtitleBgColor).onChange(async i=>{this.plugin.settings.defaultStyle.subtitleBgColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5B57\u4F53").setDesc("\u4E3B\u5B57\u4F53\u540D\u79F0").addText(n=>n.setValue(this.plugin.settings.defaultStyle.fontFamily).onChange(async i=>{this.plugin.settings.defaultStyle.fontFamily=i,await this.plugin.saveSettings()})),r.createEl("h2",{text:"\u{1F5BC}\uFE0F \u6587\u5B57\u5C01\u9762\u751F\u6210"}),new w.Setting(r).setName("\u5E95\u56FE\u7167\u7247/\u6587\u4EF6\u5939").setDesc("\u586B\u5355\u5F20\u56FE\u7247\u8DEF\u5F84\u6216\u6587\u4EF6\u5939\u8DEF\u5F84\uFF08\u6587\u4EF6\u5939\u6A21\u5F0F\u6BCF\u6B21\u968F\u673A\u9009\u4E00\u5F20\uFF09").addText(n=>n.setPlaceholder("VideoForge/covers/ \u6216 covers/photo.jpg").setValue(this.plugin.settings.coverBgImagePath).onChange(async i=>{this.plugin.settings.coverBgImagePath=i.trim(),await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5C01\u9762\u8F93\u51FA\u76EE\u5F55").setDesc("\u751F\u6210\u7684\u5C01\u9762\u4FDD\u5B58\u5230\u54EA\u4E2A\u6587\u4EF6\u5939").addText(n=>n.setPlaceholder("VideoForge/covers").setValue(this.plugin.settings.coverOutputDir).onChange(async i=>{this.plugin.settings.coverOutputDir=i.trim()||"VideoForge/covers",await this.plugin.saveSettings()})),new w.Setting(r).setName("\u5C01\u9762\u5C3A\u5BF8").addDropdown(n=>n.addOptions({"1080x1920":"\u7AD6\u7248 9:16 (1080\xD71920)","1280x720":"\u6A2A\u7248 16:9 (1280\xD7720)","1080x1080":"\u65B9\u5F62 1:1 (1080\xD71080)"}).setValue(`${this.plugin.settings.coverWidth}x${this.plugin.settings.coverHeight}`).onChange(async i=>{let[c,a]=i.split("x").map(Number);this.plugin.settings.coverWidth=c,this.plugin.settings.coverHeight=a,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u7C97\u4F53\u5B57\u53F7").setDesc("\u7B2C\u4E00\u884C\u5927\u5B57\u7684\u5B57\u53F7\uFF08\u9ED8\u8BA4 96\uFF09").addText(n=>n.setValue(String(this.plugin.settings.coverBoldSize||96)).onChange(async i=>{this.plugin.settings.coverBoldSize=parseInt(i)||96,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u7EC6\u4F53\u5B57\u53F7").setDesc("\u7B2C\u4E8C\u884C\u5C0F\u5B57\u7684\u5B57\u53F7\uFF08\u9ED8\u8BA4 64\uFF09").addText(n=>n.setValue(String(this.plugin.settings.coverNormalSize||64)).onChange(async i=>{this.plugin.settings.coverNormalSize=parseInt(i)||64,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u6587\u5B57\u989C\u8272").addColorPicker(n=>n.setValue(this.plugin.settings.coverFontColor||"#FFFFFF").onChange(async i=>{this.plugin.settings.coverFontColor=i,await this.plugin.saveSettings()})),new w.Setting(r).setName("\u8499\u7248\u900F\u660E\u5EA6").setDesc("\u5E95\u56FE\u4E0A\u53E0\u52A0\u7684\u6697\u8272\u8499\u7248\uFF08\u8D8A\u5927\u8D8A\u6697\uFF0C\u6587\u5B57\u8D8A\u6E05\u6670\uFF09").addSlider(n=>{var i;return n.setLimits(0,.8,.05).setValue((i=this.plugin.settings.coverOverlayOpacity)!=null?i:.4).setDynamicTooltip().onChange(async c=>{this.plugin.settings.coverOverlayOpacity=c,await this.plugin.saveSettings()})}),new w.Setting(r).setName("\u5B57\u4F53").setDesc("\u5C01\u9762\u6587\u5B57\u5B57\u4F53\uFF08\u9700\u7CFB\u7EDF\u5DF2\u5B89\u88C5\uFF09").addText(n=>n.setValue(this.plugin.settings.coverFontFamily||"AlibabaPuHuiTi").onChange(async i=>{this.plugin.settings.coverFontFamily=i.trim()||"AlibabaPuHuiTi",await this.plugin.saveSettings()})),r.createEl("h2",{text:"\u{1F527} \u8FDE\u63A5\u6D4B\u8BD5"}),new w.Setting(r).setName("\u6D4B\u8BD5\u6240\u6709 API \u8FDE\u63A5").setDesc("\u68C0\u67E5 Gemini\u3001TTS \u5F15\u64CE\u3001fal.ai \u7684\u8FDE\u63A5\u72B6\u6001").addButton(n=>n.setButtonText("\u6D4B\u8BD5\u8FDE\u63A5").setCta().onClick(async()=>{var a,d,g,p,m,l,u,y,f,h,x;n.setButtonText("\u6D4B\u8BD5\u4E2D..."),n.setDisabled(!0);let i=[];try{let b=(a=this.plugin.settings.geminiModel)==null?void 0:a.toLowerCase().includes("claude"),v=b?this.plugin.settings.claudeApiKey:this.plugin.settings.geminiApiKey;if(!v)throw new Error("\u672A\u914D\u7F6E");let F=(b?this.plugin.settings.claudeBaseUrl||"https://api.anthropic.com":this.plugin.settings.geminiBaseUrl||"https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/,"");/^https?:\/\//i.test(F)||(F=`https://${F}`);let $=!F.includes("googleapis.com");if(b){let P=`${F}/models`;await(0,w.requestUrl)({url:P,headers:{Authorization:`Bearer ${v}`}})}else{let P=$?`${F}/models`:`${F}/models?key=${v}`,k={};$&&(k.Authorization=`Bearer ${v}`),await(0,w.requestUrl)({url:P,headers:k})}i.push("\u2705 AI\u6A21\u578B: \u8FDE\u63A5\u6B63\u5E38")}catch(b){i.push(`\u274C AI\u6A21\u578B: ${b.message}`)}let c=this.plugin.settings.ttsEngine;if(c==="minimax")try{if(!this.plugin.settings.minimaxApiKey)throw new Error("\u672A\u914D\u7F6E API Key");if(!this.plugin.settings.minimaxGroupId)throw new Error("\u672A\u914D\u7F6E Group ID");await(0,w.requestUrl)({url:`https://api.minimax.chat/v1/t2a_v2?GroupId=${this.plugin.settings.minimaxGroupId}`,method:"POST",headers:{Authorization:`Bearer ${this.plugin.settings.minimaxApiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"speech-02-hd",text:"\u6D4B\u8BD5",stream:!1,voice_setting:{voice_id:this.plugin.settings.minimaxVoiceId||"male-qn-qingse",speed:1,vol:1,pitch:0},audio_setting:{sample_rate:32e3,bitrate:128e3,format:"mp3"}})}),i.push("\u2705 MiniMax TTS: \u8FDE\u63A5\u6B63\u5E38")}catch(b){(d=b.message)!=null&&d.includes("400")||(g=b.message)!=null&&g.includes("422")?i.push("\u2705 MiniMax TTS: \u8FDE\u63A5\u6B63\u5E38 (API \u53EF\u8FBE)"):(p=b.message)!=null&&p.includes("401")||(m=b.message)!=null&&m.includes("403")?i.push("\u274C MiniMax TTS: API Key \u65E0\u6548"):i.push(`\u274C MiniMax TTS: ${b.message}`)}else if(c==="fish-audio")try{if(!this.plugin.settings.fishAudioApiKey)throw new Error("\u672A\u914D\u7F6E API Key");await(0,w.requestUrl)({url:"https://api.fish.audio/v1/tts",method:"POST",headers:{Authorization:`Bearer ${this.plugin.settings.fishAudioApiKey}`,"Content-Type":"application/json",model:"s1"},body:JSON.stringify({text:"\u6D4B\u8BD5",reference_id:this.plugin.settings.defaultVoiceId||void 0})}),i.push("\u2705 Fish Audio: \u8FDE\u63A5\u6B63\u5E38")}catch(b){(l=b.message)!=null&&l.includes("400")||(u=b.message)!=null&&u.includes("422")?i.push("\u2705 Fish Audio: \u8FDE\u63A5\u6B63\u5E38 (API \u53EF\u8FBE)"):(y=b.message)!=null&&y.includes("401")||(f=b.message)!=null&&f.includes("403")?i.push("\u274C Fish Audio: API Key \u65E0\u6548"):i.push(`\u274C Fish Audio: ${b.message}`)}if(this.plugin.settings.whisperEngine==="fal")try{if(!this.plugin.settings.falApiKey)throw new Error("\u672A\u914D\u7F6E");await(0,w.requestUrl)({url:"https://queue.fal.run/fal-ai/whisper",method:"POST",headers:{Authorization:`Key ${this.plugin.settings.falApiKey}`,"Content-Type":"application/json"},body:JSON.stringify({audio_url:"https://example.com/test.mp3"})}),i.push("\u2705 fal.ai: \u8FDE\u63A5\u6B63\u5E38")}catch(b){(h=b.message)!=null&&h.includes("422")||(x=b.message)!=null&&x.includes("400")?i.push("\u2705 fal.ai: \u8FDE\u63A5\u6B63\u5E38 (Key \u6709\u6548)"):i.push(`\u274C fal.ai: ${b.message}`)}else i.push("\u23ED\uFE0F fal.ai: \u672A\u4F7F\u7528\uFF08\u5F53\u524D\u5B57\u5E55\u5F15\u64CE=\u672C\u5730 Whisper\uFF0C\u65E0\u9700\u914D\u7F6E\uFF09");new w.Notice(i.join(`
`),8e3),n.setButtonText("\u6D4B\u8BD5\u8FDE\u63A5"),n.setDisabled(!1)}))}};var q=require("obsidian"),re="video-forge-view",xe=class extends q.ItemView{constructor(t,e){super(t);this.contentEl_inner=null;this.stateUnsubscribe=null;this.selectedFile=null;this.plugin=e}getViewType(){return re}getDisplayText(){return"\u{1F3AC} Video Forge"}getIcon(){return"clapperboard"}async onOpen(){let t=this.containerEl.children[1];t.empty(),t.addClass("vf-panel"),this.injectStyles(t),this.contentEl_inner=t.createDiv({cls:"vf-content"}),this.renderIdleState(),this.stateUnsubscribe=this.plugin.pipeline.onStateChange(e=>{this.renderPipelineState(e)})}async onClose(){this.stateUnsubscribe&&this.stateUnsubscribe()}renderIdleState(){if(!this.contentEl_inner)return;let t=this.contentEl_inner;t.empty();let e=t.createDiv({cls:"vf-header"});e.createEl("div",{cls:"vf-logo",text:"\u{1F3AC}"}),e.createEl("h2",{text:"Video Forge",cls:"vf-title"}),e.createEl("p",{text:"\u89C6\u9891\u953B\u9020\u5DE5\u4F5C\u53F0",cls:"vf-subtitle"});let r=t.createDiv({cls:"vf-steps"}),o=this.plugin.pipeline.getTTSEngineName(),n=[{icon:"\u{1F9E0}",label:"\u62C6\u573A\u666F",desc:"AI \u667A\u80FD\u5206\u955C"},{icon:"\u{1F399}\uFE0F",label:"\u8BED\u97F3\u5408\u6210",desc:"\u6587\u5B57\u8F6C\u8BED\u97F3"},{icon:"\u23F1\uFE0F",label:"\u65F6\u95F4\u6233",desc:"\u9010\u5B57\u5BF9\u9F50"},{icon:"\u{1F3A5}",label:"\u89C6\u9891\u6E32\u67D3",desc:"\u751F\u6210\u89C6\u9891"}];for(let F of n){let $=r.createDiv({cls:"vf-step-item"});$.createEl("span",{cls:"vf-step-icon",text:F.icon});let P=$.createDiv({cls:"vf-step-text"});P.createEl("div",{cls:"vf-step-label",text:F.label}),P.createEl("div",{cls:"vf-step-desc",text:F.desc})}let i=t.createDiv({cls:"vf-note-search"}),c=i.createEl("input",{cls:"vf-search-input",attr:{type:"text",placeholder:"\u641C\u7D22\u7B14\u8BB0..."}}),a=i.createDiv({cls:"vf-search-dropdown"});a.style.display="none";let d=i.createDiv({cls:"vf-selected-note"});d.style.display="none";let g=()=>{this.selectedFile&&(d.style.display="flex",d.empty(),d.createEl("span",{cls:"vf-selected-name",text:`\u{1F4C4} ${this.selectedFile.basename}`}),d.createEl("span",{cls:"vf-selected-clear",text:"\u2715"}).addEventListener("click",()=>{this.selectedFile=null,d.style.display="none",c.style.display="",c.value="",h.textContent="\u{1F680} \u4ECE\u5F53\u524D\u7B14\u8BB0\u5F00\u59CB"}),c.style.display="none",h.textContent="\u{1F680} \u4ECE\u9009\u4E2D\u7B14\u8BB0\u5F00\u59CB")};c.addEventListener("input",()=>{var P;let F=c.value.trim().toLowerCase();if(a.empty(),!F){a.style.display="none";return}let $=this.app.vault.getMarkdownFiles().filter(k=>k.path.toLowerCase().includes(F)).slice(0,8);if($.length===0){a.style.display="none";return}a.style.display="block";for(let k of $){let D=a.createDiv({cls:"vf-search-item"});D.createEl("span",{cls:"vf-search-item-name",text:k.basename}),D.createEl("span",{cls:"vf-search-item-path",text:((P=k.parent)==null?void 0:P.path)||""}),D.addEventListener("click",()=>{this.selectedFile=k,a.style.display="none",g()})}}),c.addEventListener("blur",()=>{setTimeout(()=>{a.style.display="none"},200)}),c.addEventListener("focus",()=>{c.value.trim()&&c.dispatchEvent(new Event("input"))});let p=t.createDiv({cls:"vf-actions"}),m=p.createDiv({cls:"vf-aspect-toggle"});m.style.cssText="display:flex;gap:6px;margin-bottom:8px;";let l=(this.plugin.settings.videoHeight||1080)>(this.plugin.settings.videoWidth||1920),u=m.createEl("button",{cls:`vf-btn ${l?"vf-btn-ghost":"vf-btn-primary"}`,text:"\u{1F4FA} \u6A2A\u5C4F 16:9"});u.style.cssText="flex:1;padding:6px 0;font-size:13px;";let y=m.createEl("button",{cls:`vf-btn ${l?"vf-btn-primary":"vf-btn-ghost"}`,text:"\u{1F4F1} \u7AD6\u5C4F 9:16"});y.style.cssText="flex:1;padding:6px 0;font-size:13px;";let f=()=>{let F=(this.plugin.settings.videoHeight||1080)>(this.plugin.settings.videoWidth||1920);u.className=`vf-btn ${F?"vf-btn-ghost":"vf-btn-primary"}`,y.className=`vf-btn ${F?"vf-btn-primary":"vf-btn-ghost"}`};u.addEventListener("click",async()=>{this.plugin.settings.videoWidth=1920,this.plugin.settings.videoHeight=1080,await this.plugin.saveSettings(),f(),new q.Notice("\u5DF2\u5207\u6362\u4E3A\u6A2A\u5C4F 16:9")}),y.addEventListener("click",async()=>{this.plugin.settings.videoWidth=1080,this.plugin.settings.videoHeight=1920,await this.plugin.saveSettings(),f(),new q.Notice("\u5DF2\u5207\u6362\u4E3A\u7AD6\u5C4F 9:16")});let h=p.createEl("button",{cls:"vf-btn vf-btn-primary",text:"\u{1F680} \u4ECE\u5F53\u524D\u7B14\u8BB0\u5F00\u59CB"});h.addEventListener("click",()=>this.startFromActiveFile()),p.createEl("button",{cls:"vf-btn vf-btn-secondary",text:"\u{1F5BC}\uFE0F \u751F\u6210\u6587\u5B57\u5C01\u9762"}).addEventListener("click",()=>this.plugin.showCoverInputModal(this.selectedFile||void 0)),p.createEl("button",{cls:"vf-btn vf-btn-secondary",text:"\u{1F3AC} \u6E32\u67D3\u89C6\u9891"}).addEventListener("click",async()=>{console.log("[VideoForge] \u6E32\u67D3\u6309\u94AE\u88AB\u70B9\u51FB, pipeline:",!!this.plugin.pipeline);try{await this.plugin.pipeline.renderToDisk()}catch(F){console.error("[VideoForge] renderToDisk \u62A5\u9519:",F),new(require("obsidian")).Notice(`\u26A0\uFE0F \u6E32\u67D3\u5931\u8D25: ${F.message}`)}}),p.createEl("button",{cls:"vf-btn vf-btn-ghost",text:"\u2699\uFE0F \u63D2\u4EF6\u8BBE\u7F6E"}).addEventListener("click",()=>{this.app.setting.open(),this.app.setting.openTabById("video-forge")});let C=t.createDiv({cls:"vf-status-check"});this.renderStatusCheck(C)}renderPipelineState(t){if(!this.contentEl_inner)return;let e=this.contentEl_inner;e.empty(),e.createDiv({cls:"vf-header vf-header-compact"}).createEl("h3",{text:"\u{1F3AC} Video Forge",cls:"vf-title"});let o=e.createDiv({cls:"vf-progress-wrap"}),i=o.createDiv({cls:"vf-progress-bar"}).createDiv({cls:"vf-progress-fill"});i.style.width=`${t.progress}%`,t.stage==="error"?i.addClass("vf-progress-error"):t.stage==="complete"&&i.addClass("vf-progress-complete"),o.createEl("div",{cls:"vf-progress-label",text:`${Math.round(t.progress)}%`});let c=e.createDiv({cls:"vf-stage-indicators"}),a=[{key:"splitting",icon:"\u{1F9E0}",label:"\u62C6\u573A\u666F"},{key:"tts",icon:"\u{1F399}\uFE0F",label:"TTS"},{key:"timestamping",icon:"\u23F1\uFE0F",label:"\u65F6\u95F4\u6233"},{key:"composing",icon:"\u{1F527}",label:"\u5408\u6210"},{key:"rendering",icon:"\u{1F3A5}",label:"\u6E32\u67D3"}],g=a.map(m=>m.key).indexOf(t.stage);for(let m=0;m<a.length;m++){let l=a[m],u=m<g?"vf-stage done":m===g?"vf-stage active":"vf-stage pending",y=c.createDiv({cls:u});y.createEl("span",{cls:"vf-stage-icon",text:l.icon}),y.createEl("span",{cls:"vf-stage-label",text:l.label})}let p=e.createDiv({cls:"vf-message"});if(p.createEl("p",{text:t.message}),t.currentScene>0&&p.createEl("p",{cls:"vf-scene-counter",text:`\u573A\u666F ${t.currentScene} / ${t.totalScenes}`}),t.logs&&t.logs.length>0){let m=e.createDiv({cls:"vf-logs"});for(let l of t.logs)m.createEl("p",{text:l,cls:"vf-log-line"})}if(t.error){let m=e.createDiv({cls:"vf-error"});m.createEl("p",{text:`\u274C ${t.error}`}),m.createEl("button",{cls:"vf-btn vf-btn-secondary",text:"\u{1F504} \u91CD\u65B0\u5F00\u59CB"}).addEventListener("click",()=>this.renderIdleState())}if(t.stage==="complete"){let m=e.createDiv({cls:"vf-complete"});if(m.createEl("div",{cls:"vf-complete-icon",text:"\u{1F389}"}),m.createEl("h3",{text:"\u89C6\u9891\u9879\u76EE\u751F\u6210\u5B8C\u6210\uFF01"}),m.createEl("p",{text:t.message}),t.logs&&t.logs.length>0){let f=t.logs.some(C=>C.startsWith("\u274C")),h=t.logs.some(C=>C.startsWith("\u26A0\uFE0F")),x=m.createDiv({cls:"vf-check-card"}),b=x.createDiv({cls:"vf-check-header"});f?b.createEl("span",{text:"\u274C \u81EA\u68C0\u53D1\u73B0\u95EE\u9898",cls:"vf-check-title vf-check-fail"}):h?b.createEl("span",{text:"\u26A0\uFE0F \u81EA\u68C0\u6709\u8B66\u544A",cls:"vf-check-title vf-check-warn"}):b.createEl("span",{text:"\u2705 \u81EA\u68C0\u5168\u90E8\u901A\u8FC7",cls:"vf-check-title vf-check-pass"});let v=x.createDiv({cls:"vf-check-body"});for(let C of t.logs)v.createEl("div",{text:C,cls:"vf-check-line"})}let l=m.createDiv({cls:"vf-complete-actions"}),u=l.createEl("button",{cls:"vf-btn vf-btn-primary",text:"\u{1F3AC} \u6E32\u67D3\u89C6\u9891"});u.addEventListener("click",async()=>{u.disabled=!0,u.setText("\u23F3 \u6E32\u67D3\u4E2D...");try{await this.plugin.pipeline.renderToDisk()}catch(f){new(require("obsidian")).Notice(`\u26A0\uFE0F \u6E32\u67D3\u5931\u8D25: ${f.message}`)}finally{u.disabled=!1,u.setText("\u{1F3AC} \u6E32\u67D3\u89C6\u9891")}}),l.createEl("button",{cls:"vf-btn vf-btn-secondary",text:"\u{1F4DD} \u65B0\u5EFA\u9879\u76EE"}).addEventListener("click",()=>this.renderIdleState()),l.createEl("p",{cls:"vf-hint",text:"\u{1F4A1} \u70B9\u300C\u{1F3AC} \u6E32\u67D3\u89C6\u9891\u300D\u628A\u9879\u76EE\u6E32\u67D3\u6210 mp4\uFF0C\u8F93\u51FA\u5230\u8BBE\u7F6E\u91CC\u7684\u89C6\u9891\u76EE\u5F55"})}}async startFromActiveFile(){var m,l;let t=this.selectedFile||this.app.workspace.getActiveFile();if(!t||t.extension!=="md"){new q.Notice("\u26A0\uFE0F \u8BF7\u5148\u6253\u5F00\u6216\u641C\u7D22\u9009\u62E9\u4E00\u4E2A Markdown \u6587\u4EF6\u4F5C\u4E3A\u811A\u672C");return}let e=this.plugin.settings,r=[],o=(m=e.geminiModel)==null?void 0:m.toLowerCase().includes("claude");if(!o&&!e.geminiApiKey&&r.push("Gemini API Key"),o&&!e.claudeApiKey&&r.push("Claude API Key"),e.ttsEngine==="minimax"?(!e.minimaxApiKey||!e.minimaxGroupId)&&r.push("MiniMax API Key/Group ID"):e.ttsEngine==="fish-audio"&&(e.fishAudioApiKey||r.push("Fish Audio API Key")),e.whisperEngine==="fal"&&!e.falApiKey&&r.push("fal.ai API Key"),r.length>0){new q.Notice(`\u26A0\uFE0F \u8BF7\u5148\u914D\u7F6E: ${r.join(", ")}`);return}let n=e.ttsEngine==="minimax"?e.minimaxVoiceId||"male-qn-qingse":e.defaultVoiceId||"",i=await this.app.vault.read(t),c=i.match(/^#\s*视频标题[：:]\s*(.+)$/m),a=c?c[1].trim():t.basename,d=this.app.metadataCache.getFileCache(t),g=((l=d==null?void 0:d.frontmatter)==null?void 0:l.bgm)||void 0,p={title:a,content:i,sourcePath:t.path,bgmFile:g};try{await this.plugin.pipeline.run(p,n)}catch(u){}}showVoiceCloneDialog(){new q.Notice('\u{1F3A4} \u8BED\u97F3\u514B\u9686: \u8BF7\u5728 Vault \u4E2D\u653E\u7F6E\u4E00\u6BB5 MP3 \u97F3\u9891\u6587\u4EF6\uFF0C\u7136\u540E\u4F7F\u7528\u547D\u4EE4\u9762\u677F\u7684 "Video Forge: \u514B\u9686\u8BED\u97F3" \u547D\u4EE4')}renderStatusCheck(t){var a;t.empty(),t.createEl("h4",{text:"\u8FDE\u63A5\u72B6\u6001",cls:"vf-status-title"});let e=this.plugin.settings,r=!1;e.ttsEngine==="minimax"?r=!!(e.minimaxApiKey&&e.minimaxGroupId):e.ttsEngine==="fish-audio"&&(r=!!e.fishAudioApiKey);let n=((a=e.geminiModel)==null?void 0:a.toLowerCase().includes("claude"))?!!e.claudeApiKey:!!e.geminiApiKey,i=e.whisperEngine==="fal"?!!e.falApiKey:!0,c=[{name:"AI \u5206\u955C",ok:n},{name:"\u8BED\u97F3\u5408\u6210",ok:r},{name:"\u5B57\u5E55\u5F15\u64CE",ok:i},{name:"\u89C6\u9891\u6E32\u67D3",ok:!!e.remotionProjectPath}];for(let d of c){let g=t.createDiv({cls:"vf-status-row"});g.createEl("span",{cls:d.ok?"vf-dot-ok":"vf-dot-err"}),g.createEl("span",{text:d.name}),g.createEl("span",{cls:"vf-status-val",text:d.ok?"\u5DF2\u914D\u7F6E":"\u672A\u914D\u7F6E"})}}injectStyles(t){let e=t.createEl("style");e.textContent=`
      .vf-panel {
        padding: 0;
        height: 100%;
        overflow-y: auto;
        font-family: var(--font-interface);
      }
      .vf-content {
        padding: 20px 16px;
      }

      /* Header */
      .vf-header {
        text-align: center;
        padding: 20px 0 16px;
        border-bottom: 1px solid var(--background-modifier-border);
        margin-bottom: 20px;
      }
      .vf-header-compact { padding: 12px 0 8px; margin-bottom: 12px; }
      .vf-logo { font-size: 48px; margin-bottom: 8px; }
      .vf-title {
        margin: 0;
        font-size: 1.3em;
        font-weight: 700;
        background: linear-gradient(135deg, #FF6B35, #F7C948);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .vf-subtitle {
        margin: 4px 0 0;
        color: var(--text-muted);
        font-size: 0.85em;
      }

      /* Pipeline Steps */
      .vf-steps {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
      }
      .vf-step-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: var(--background-secondary);
        border: 1px solid var(--background-modifier-border);
        transition: all 0.2s;
      }
      .vf-step-item:hover {
        border-color: var(--interactive-accent);
        transform: translateX(4px);
      }
      .vf-step-icon { font-size: 1.4em; }
      .vf-step-label { font-weight: 600; font-size: 0.9em; }
      .vf-step-desc { font-size: 0.78em; color: var(--text-muted); }

      /* Buttons */
      .vf-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
      }
      .vf-btn {
        padding: 10px 16px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 0.9em;
        font-weight: 600;
        transition: all 0.2s;
        text-align: center;
      }
      .vf-btn-primary {
        background: linear-gradient(135deg, #FF6B35, #E85D26);
        color: white;
      }
      .vf-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,107,53,0.4); }
      .vf-btn-secondary {
        background: var(--background-secondary);
        color: var(--text-normal);
        border: 1px solid var(--background-modifier-border);
      }
      .vf-btn-secondary:hover { border-color: var(--interactive-accent); }
      .vf-btn-ghost {
        background: transparent;
        color: var(--text-muted);
      }
      .vf-btn-ghost:hover { color: var(--text-normal); }

      /* Progress */
      .vf-progress-wrap { margin: 16px 0; }
      .vf-progress-bar {
        height: 6px;
        background: var(--background-modifier-border);
        border-radius: 3px;
        overflow: hidden;
      }
      .vf-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #FF6B35, #F7C948);
        border-radius: 3px;
        transition: width 0.5s ease;
      }
      .vf-progress-error { background: #e74c3c !important; }
      .vf-progress-complete { background: #2ecc71 !important; }
      .vf-progress-label {
        text-align: right;
        font-size: 0.8em;
        color: var(--text-muted);
        margin-top: 4px;
      }

      /* Stage Indicators */
      .vf-stage-indicators {
        display: flex;
        justify-content: space-between;
        gap: 4px;
        margin: 12px 0;
      }
      .vf-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border-radius: 6px;
        flex: 1;
        font-size: 0.72em;
        transition: all 0.3s;
      }
      .vf-stage.active {
        background: rgba(255,107,53,0.15);
        color: #FF6B35;
      }
      .vf-stage.done {
        color: #2ecc71;
      }
      .vf-stage.pending {
        color: var(--text-muted);
        opacity: 0.5;
      }
      .vf-stage-icon { font-size: 1.5em; }
      .vf-stage-label { font-weight: 600; }

      /* Messages */
      .vf-message {
        padding: 12px;
        background: var(--background-secondary);
        border-radius: 8px;
        margin: 12px 0;
        border-left: 3px solid #FF6B35;
      }
      .vf-message p { margin: 4px 0; font-size: 0.88em; }
      .vf-scene-counter { color: var(--text-muted); font-size: 0.8em !important; }

      /* Logs */
      .vf-logs {
        padding: 10px 12px;
        background: var(--background-secondary);
        border-radius: 8px;
        margin-top: 8px;
        border-left: 3px solid #3498db;
        max-height: 300px;
        overflow-y: auto;
      }
      .vf-log-line {
        margin: 2px 0;
        font-size: 0.82em;
        font-family: var(--font-monospace);
        line-height: 1.5;
        color: var(--text-normal);
      }

      /* \u81EA\u68C0\u62A5\u544A\u5361\u7247 */
      .vf-check-card {
        margin-top: 12px;
        border-radius: 8px;
        background: var(--background-secondary);
        border: 1px solid var(--background-modifier-border);
        overflow: hidden;
      }
      .vf-check-header {
        padding: 8px 12px;
        background: var(--background-secondary-alt);
        border-bottom: 1px solid var(--background-modifier-border);
      }
      .vf-check-title {
        font-weight: 600;
        font-size: 0.9em;
      }
      .vf-check-pass { color: #27ae60; }
      .vf-check-warn { color: #f39c12; }
      .vf-check-fail { color: #e74c3c; }
      .vf-check-body {
        padding: 8px 12px;
        max-height: 200px;
        overflow-y: auto;
      }
      .vf-check-line {
        margin: 2px 0;
        font-size: 0.82em;
        font-family: var(--font-monospace);
        line-height: 1.5;
        color: var(--text-normal);
      }

      /* Error */
      .vf-error {
        padding: 12px;
        background: rgba(231,76,60,0.1);
        border-radius: 8px;
        border-left: 3px solid #e74c3c;
        margin: 12px 0;
      }
      .vf-error p { color: #e74c3c; font-size: 0.88em; margin: 0 0 8px; }

      /* Complete */
      .vf-complete {
        text-align: center;
        padding: 20px 0;
      }
      .vf-complete-icon { font-size: 48px; margin-bottom: 12px; }
      .vf-complete h3 { margin: 0 0 8px; }
      .vf-complete p { font-size: 0.85em; color: var(--text-muted); }
      .vf-complete-actions { margin-top: 16px; }
      .vf-hint {
        margin-top: 12px !important;
        padding: 8px 12px;
        background: var(--background-secondary);
        border-radius: 6px;
        font-size: 0.8em !important;
      }

      /* Status Check */
      .vf-status-check {
        padding: 12px;
        background: var(--background-secondary);
        border-radius: 8px;
      }
      .vf-status-title { margin: 0 0 8px; font-size: 0.85em; }
      .vf-status-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        font-size: 0.82em;
      }
      .vf-status-val { margin-left: auto; color: var(--text-muted); font-size: 0.85em; }
      .vf-dot-ok, .vf-dot-err {
        width: 8px; height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .vf-dot-ok { background: #2ecc71; }
      .vf-dot-err { background: #e74c3c; }

      /* Note Search */
      .vf-note-search {
        position: relative;
        margin-bottom: 12px;
      }
      .vf-search-input {
        width: 100%;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid var(--background-modifier-border);
        background: var(--background-primary);
        color: var(--text-normal);
        font-size: 0.88em;
        outline: none;
        box-sizing: border-box;
      }
      .vf-search-input:focus {
        border-color: var(--interactive-accent);
        box-shadow: 0 0 0 2px rgba(255,107,53,0.2);
      }
      .vf-search-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 8px;
        margin-top: 4px;
        max-height: 280px;
        overflow-y: auto;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .vf-search-item {
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-bottom: 1px solid var(--background-modifier-border);
      }
      .vf-search-item:last-child { border-bottom: none; }
      .vf-search-item:hover { background: var(--background-secondary); }
      .vf-search-item-name { font-size: 0.88em; font-weight: 600; }
      .vf-search-item-path { font-size: 0.75em; color: var(--text-muted); }
      .vf-selected-note {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--background-secondary);
        border: 1px solid var(--interactive-accent);
      }
      .vf-selected-name { font-size: 0.88em; font-weight: 600; }
      .vf-selected-clear {
        cursor: pointer;
        color: var(--text-muted);
        font-size: 0.9em;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .vf-selected-clear:hover { background: var(--background-modifier-border); color: var(--text-normal); }
    `}};var Re=require("obsidian"),ve=class extends Re.Modal{constructor(t,e,r,o){super(t);this.scenes=JSON.parse(JSON.stringify(e)),this.onConfirm=r,this.onCancel=o}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("vf-scene-editor");let e=t.createDiv({cls:"vf-se-header"});e.createEl("h2",{text:"\u{1F3AC} \u573A\u666F\u7F16\u8F91\u5668"}),e.createEl("p",{text:`\u5171 ${this.scenes.length} \u4E2A\u573A\u666F\uFF0C\u53EF\u7F16\u8F91\u65C1\u767D\u3001\u8C03\u6574\u987A\u5E8F\u6216\u5220\u9664`,cls:"vf-se-subtitle"});let r=t.createDiv({cls:"vf-se-list"});for(let a=0;a<this.scenes.length;a++)this.renderSceneCard(r,this.scenes[a],a);let o=t.createDiv({cls:"vf-se-footer"});o.createEl("button",{cls:"vf-btn vf-btn-secondary",text:"+ \u65B0\u589E\u573A\u666F"}).addEventListener("click",()=>{this.scenes.push({id:`scene-${String(this.scenes.length+1).padStart(3,"0")}`,index:this.scenes.length,narration:"",visualPrompt:"",duration:15,emotion:"neutral",notes:"",bgImageKeywords:[]}),this.onOpen()}),o.createEl("button",{cls:"vf-btn vf-btn-ghost",text:"\u53D6\u6D88"}).addEventListener("click",()=>{this.onCancel(),this.close()}),o.createEl("button",{cls:"vf-btn vf-btn-primary",text:"\u2705 \u786E\u8BA4\u5E76\u7EE7\u7EED"}).addEventListener("click",()=>{this.scenes.forEach((a,d)=>{a.index=d,a.id=`scene-${String(d+1).padStart(3,"0")}`}),this.onConfirm(this.scenes),this.close()}),this.injectStyles(t)}renderSceneCard(t,e,r){let o=t.createDiv({cls:"vf-se-card"}),n=o.createDiv({cls:"vf-se-card-title"});n.createEl("span",{cls:"vf-se-card-num",text:`#${r+1}`}),n.createEl("span",{cls:"vf-se-card-emotion",text:this.emotionLabel(e.emotion)}),n.createEl("button",{cls:"vf-se-del-btn",text:"\u{1F5D1}\uFE0F"}).addEventListener("click",()=>{this.scenes.splice(r,1),this.onOpen()}),o.createEl("label",{text:"\u65C1\u767D\u6587\u672C",cls:"vf-se-label"});let c=o.createEl("textarea",{cls:"vf-se-textarea"});c.value=e.narration,c.rows=3,c.addEventListener("input",()=>{e.narration=c.value}),o.createEl("label",{text:"\u753B\u9762\u63CF\u8FF0",cls:"vf-se-label"});let a=o.createEl("input",{cls:"vf-se-input",type:"text",value:e.visualPrompt});a.addEventListener("input",()=>{e.visualPrompt=a.value});let d=o.createDiv({cls:"vf-se-meta-row"}),g=d.createEl("select",{cls:"vf-se-select"}),p=[{value:"neutral",label:"\u{1F518} \u5E73\u9759"},{value:"excited",label:"\u{1F525} \u6FC0\u52A8"},{value:"serious",label:"\u{1F610} \u4E25\u8083"},{value:"humorous",label:"\u{1F604} \u5E7D\u9ED8"},{value:"dramatic",label:"\u{1F3AD} \u620F\u5267"},{value:"calm",label:"\u{1F30A} \u5E73\u548C"},{value:"inspiring",label:"\u2728 \u9F13\u821E"},{value:"mysterious",label:"\u{1F311} \u795E\u79D8"}];for(let l of p){let u=g.createEl("option",{value:l.value,text:l.label});l.value===e.emotion&&(u.selected=!0)}g.addEventListener("change",()=>{e.emotion=g.value});let m=d.createEl("input",{cls:"vf-se-input vf-se-dur",type:"number",value:String(e.duration)});m.min="5",m.max="60",d.createEl("span",{text:"\u79D2",cls:"vf-se-dur-label"}),m.addEventListener("input",()=>{e.duration=Number(m.value)||15})}emotionLabel(t){return{neutral:"\u{1F518} \u5E73\u9759",excited:"\u{1F525} \u6FC0\u52A8",serious:"\u{1F610} \u4E25\u8083",humorous:"\u{1F604} \u5E7D\u9ED8",dramatic:"\u{1F3AD} \u620F\u5267",calm:"\u{1F30A} \u5E73\u548C",inspiring:"\u2728 \u9F13\u821E",mysterious:"\u{1F311} \u795E\u79D8"}[t]||t}injectStyles(t){let e=t.createEl("style");e.textContent=`
      .vf-scene-editor { max-width: 700px; }
      .vf-se-header { margin-bottom: 16px; }
      .vf-se-header h2 { margin: 0; }
      .vf-se-subtitle { color: var(--text-muted); font-size: 0.85em; margin: 4px 0 0; }

      .vf-se-list { max-height: 60vh; overflow-y: auto; }
      .vf-se-card {
        padding: 12px;
        margin-bottom: 10px;
        background: var(--background-secondary);
        border-radius: 8px;
        border: 1px solid var(--background-modifier-border);
      }
      .vf-se-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .vf-se-card-num {
        font-weight: 700;
        color: #FF6B35;
        font-size: 0.9em;
      }
      .vf-se-card-emotion { font-size: 0.8em; color: var(--text-muted); }
      .vf-se-del-btn {
        margin-left: auto;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1em;
        opacity: 0.5;
      }
      .vf-se-del-btn:hover { opacity: 1; }

      .vf-se-label { font-size: 0.78em; color: var(--text-muted); display: block; margin: 6px 0 2px; }
      .vf-se-textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background: var(--background-primary);
        color: var(--text-normal);
        font-family: inherit;
        resize: vertical;
        font-size: 0.88em;
      }
      .vf-se-input {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background: var(--background-primary);
        color: var(--text-normal);
        font-size: 0.88em;
      }
      .vf-se-meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }
      .vf-se-select {
        padding: 6px 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background: var(--background-primary);
        color: var(--text-normal);
        font-size: 0.85em;
        flex: 1;
      }
      .vf-se-dur { width: 60px; flex: unset; }
      .vf-se-dur-label { font-size: 0.8em; color: var(--text-muted); }

      .vf-se-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--background-modifier-border);
      }
    `}onClose(){this.contentEl.empty()}};var Se=class extends E.Plugin{constructor(){super(...arguments);this.settings=ae;this.whisperProcess=null}async onload(){console.log("\u{1F3AC} Video Forge: Loading..."),await this.loadSettings(),this.pipeline=new he(this.app,this.settings),this.coverGenerator=new ye(this.app,this.settings),this.registerView(re,t=>new xe(t,this)),this.addSettingTab(new be(this.app,this)),this.addRibbonIcon("clapperboard","Video Forge \u{1F3AC}",()=>{this.activateView()}),this.addCommand({id:"open-video-forge",name:"\u6253\u5F00 Video Forge \u9762\u677F",callback:()=>this.activateView()}),this.addCommand({id:"forge-current-note",name:"\u{1F680} \u4ECE\u5F53\u524D\u7B14\u8BB0\u751F\u6210\u89C6\u9891",editorCallback:async(t,e)=>{let r=e.file;if(!r){new E.Notice("\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A\u6587\u4EF6");return}await this.activateView(),this.forgeFromFile(r)}}),this.addCommand({id:"split-scenes-only",name:"\u{1F9E0} \u4EC5\u62C6\u573A\u666F (Gemini \u9884\u89C8)",editorCallback:async(t,e)=>{let r=e.file;if(!r)return;let o=t.getValue();if(!o.trim()){new E.Notice("\u5F53\u524D\u6587\u4EF6\u4E3A\u7A7A");return}new E.Notice("\u{1F9E0} Gemini \u6B63\u5728\u62C6\u89E3\u573A\u666F...");try{let n=await this.pipeline.stepSplitScenes(o);new ve(this.app,n,i=>this.writeScenesToFile(r.basename,i),()=>new E.Notice("\u5DF2\u53D6\u6D88")).open()}catch(n){new E.Notice("\u573A\u666F\u62C6\u89E3\u5931\u8D25: "+n.message)}}}),this.addCommand({id:"clone-voice",name:"\u{1F3A4} \u4ECE\u97F3\u9891\u6587\u4EF6\u514B\u9686\u8BED\u97F3",callback:()=>this.handleVoiceClone()}),this.addCommand({id:"test-connections",name:"\u{1F527} \u6D4B\u8BD5 API \u8FDE\u63A5",callback:()=>this.testConnections()}),this.addCommand({id:"generate-cover",name:"\u{1F5BC}\uFE0F \u751F\u6210\u6587\u5B57\u5C01\u9762",callback:()=>this.showCoverInputModal()}),this.startWhisperServer(),console.log("\u{1F3AC} Video Forge: Ready!")}onunload(){this.stopWhisperServer(),console.log("\u{1F3AC} Video Forge: Unloaded")}async startWhisperServer(){if(this.settings.whisperEngine!=="local")return;let t=this.settings.localWhisperUrl||"http://127.0.0.1:5111",e=parseInt(t.split(":").pop()||"5111",10)||5111;try{let r=require("net");if(await new Promise(n=>{let i=r.connect(e,"127.0.0.1"),c=a=>{try{i.destroy()}catch(d){}n(a)};i.on("connect",()=>c(!0)),i.on("error",()=>c(!1)),setTimeout(()=>c(!1),1e3)})){console.log("[VideoForge] whisper \u670D\u52A1\u5DF2\u5728\u8FD0\u884C\uFF0C\u8DF3\u8FC7\u81EA\u52A8\u542F\u52A8");return}}catch(r){}try{let{spawn:r}=require("child_process"),{existsSync:o}=require("fs"),n=process.platform==="win32",i=this.app.vault.adapter.getBasePath(),c=`${i}/VideoForge/whisper-server.py`;if(!o(c)){console.log("[VideoForge] \u672A\u627E\u5230 whisper-server.py\uFF0C\u8DF3\u8FC7\u81EA\u52A8\u542F\u52A8");return}let a=n?"python":"python3",d=n?`${a} "${c}"`:`/bin/zsh -lc 'cd "${i}" && ${a} "${c}"' || /bin/bash -lc 'cd "${i}" && ${a} "${c}"'`;this.whisperProcess=r(d,{shell:!0,cwd:i}),this.whisperProcess.on("error",g=>console.error("[VideoForge] whisper \u81EA\u52A8\u542F\u52A8\u5931\u8D25:",g.message)),console.log("[VideoForge] whisper \u670D\u52A1\u81EA\u52A8\u542F\u52A8\u4E2D\uFF08\u7AEF\u53E3 "+e+"\uFF09...")}catch(r){console.error("[VideoForge] whisper \u542F\u52A8\u5F02\u5E38:",r.message)}}stopWhisperServer(){if(this.whisperProcess){try{this.whisperProcess.kill()}catch(t){}this.whisperProcess=null}}async forgeFromFile(t){var p,m;let e=[],r=(p=this.settings.geminiModel)==null?void 0:p.toLowerCase().includes("claude");if(!r&&!this.settings.geminiApiKey&&e.push("Gemini API Key"),r&&!this.settings.claudeApiKey&&e.push("Claude API Key"),this.settings.ttsEngine==="fish-audio"?this.settings.fishAudioApiKey||e.push("Fish Audio API Key"):this.settings.ttsEngine==="minimax"&&(this.settings.minimaxApiKey||e.push("MiniMax API Key"),this.settings.minimaxGroupId||e.push("MiniMax Group ID")),this.settings.whisperEngine==="fal"&&!this.settings.falApiKey&&e.push("fal.ai API Key"),e.length>0){new E.Notice("\u8BF7\u5148\u914D\u7F6E: "+e.join(", "));return}let o=await this.app.vault.read(t),n=o.match(/^#\s*视频标题[：:]\s*(.+)$/m),i=n?n[1].trim():t.basename,c=this.app.metadataCache.getFileCache(t),a=((m=c==null?void 0:c.frontmatter)==null?void 0:m.bgm)||void 0,d={title:i,content:o,sourcePath:t.path,bgmFile:a},g=this.settings.ttsEngine==="minimax"?this.settings.minimaxVoiceId||"":this.settings.defaultVoiceId||"";try{await this.pipeline.run(d,g)}catch(l){}}async handleVoiceClone(){let t=this.app.vault.getFiles().filter(o=>/\.(mp3|wav|m4a|ogg)$/i.test(o.extension));if(t.length===0){new E.Notice("Vault \u4E2D\u6CA1\u6709\u627E\u5230\u97F3\u9891\u6587\u4EF6 (mp3/wav/m4a/ogg)");return}let e=`clone_${Date.now()}`,r=t[0];new E.Notice("\u{1F3A4} \u6B63\u5728\u4E0A\u4F20\u8BAD\u7EC3\u97F3\u9891: "+r.name);try{let o=await this.app.vault.readBinary(r);await this.pipeline.cloneVoice(o,e),new E.Notice("\u2705 \u97F3\u9891\u5DF2\u4E0A\u4F20\uFF0C\u58F0\u97F3\u590D\u523B\u8BAD\u7EC3\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u5728\u63A7\u5236\u53F0\u67E5\u770B\u72B6\u6001")}catch(o){new E.Notice("\u58F0\u97F3\u590D\u523B\u5931\u8D25: "+o.message)}}async testConnections(){var r,o,n,i,c,a,d,g,p,m;let t=[],e=this.settings;if(e.geminiApiKey)try{let l=(e.geminiBaseUrl||"https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/,""),u=!l.includes("googleapis.com"),y=u?`${l}/models`:`${l}/models?key=${e.geminiApiKey}`,f={};u&&(f.Authorization=`Bearer ${e.geminiApiKey}`),await(0,E.requestUrl)({url:y,headers:f}),t.push("\u2705 Gemini OK")}catch(l){t.push("\u274C Gemini \u5931\u8D25")}else t.push("\u26AA Gemini \u672A\u914D\u7F6E");if(e.ttsEngine==="minimax")if(e.minimaxApiKey&&e.minimaxGroupId)try{await(0,E.requestUrl)({url:`https://api.minimax.chat/v1/t2a_v2?GroupId=${e.minimaxGroupId}`,method:"POST",headers:{Authorization:`Bearer ${e.minimaxApiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"speech-02-hd",text:"\u6D4B\u8BD5",stream:!1,voice_setting:{voice_id:e.minimaxVoiceId||"male-qn-qingse",speed:1,vol:1,pitch:0},audio_setting:{sample_rate:32e3,bitrate:128e3,format:"mp3"}})}),t.push("\u2705 MiniMax OK")}catch(l){(r=l.message)!=null&&r.includes("400")||(o=l.message)!=null&&o.includes("422")?t.push("\u2705 MiniMax OK\uFF08API \u53EF\u8FBE\uFF09"):(n=l.message)!=null&&n.includes("401")||(i=l.message)!=null&&i.includes("403")?t.push("\u274C MiniMax API Key \u65E0\u6548"):t.push("\u274C MiniMax \u5931\u8D25: "+(l.message||"\u672A\u77E5\u9519\u8BEF"))}else t.push("\u26AA MiniMax \u672A\u914D\u7F6E");if(e.ttsEngine==="fish-audio")if(e.fishAudioApiKey)try{await(0,E.requestUrl)({url:"https://api.fish.audio/v1/tts",method:"POST",headers:{Authorization:`Bearer ${e.fishAudioApiKey}`,"Content-Type":"application/json",model:"s1"},body:JSON.stringify({text:"\u6D4B\u8BD5",reference_id:e.defaultVoiceId||void 0})}),t.push("\u2705 Fish Audio OK")}catch(l){(c=l.message)!=null&&c.includes("400")||(a=l.message)!=null&&a.includes("422")?t.push("\u2705 Fish Audio OK\uFF08API \u53EF\u8FBE\uFF09"):(d=l.message)!=null&&d.includes("401")||(g=l.message)!=null&&g.includes("403")?t.push("\u274C Fish Audio API Key \u65E0\u6548"):t.push("\u274C Fish Audio \u5931\u8D25: "+(l.message||"\u672A\u77E5\u9519\u8BEF"))}else t.push("\u26AA Fish Audio \u672A\u914D\u7F6E");if(e.falApiKey)try{await(0,E.requestUrl)({url:"https://queue.fal.run/fal-ai/whisper",method:"POST",headers:{Authorization:`Key ${e.falApiKey}`,"Content-Type":"application/json"},body:JSON.stringify({audio_url:"https://example.com/test.mp3"})}),t.push("\u2705 fal.ai OK")}catch(l){(p=l.message)!=null&&p.includes("422")||(m=l.message)!=null&&m.includes("400")?t.push("\u2705 fal.ai OK"):t.push("\u274C fal.ai \u5931\u8D25")}else t.push("\u26AA fal.ai \u672A\u914D\u7F6E");new E.Notice(t.join(`
`),6e3)}async writeScenesToFile(t,e){let r=["---","type: video-forge-scenes","source: "+t,"created: "+new Date().toISOString(),"---","","# \u{1F3AC} "+t+" - \u573A\u666F\u5206\u955C",""];for(let i of e)r.push("## \u573A\u666F "+(i.index+1)+" | "+i.emotion),r.push(""),r.push("**\u65C1\u767D\uFF1A**"),r.push(i.narration),r.push(""),r.push("**\u753B\u9762\uFF1A** "+i.visualPrompt),r.push(""),r.push("**\u65F6\u957F\uFF1A** ~"+i.duration+" \u79D2"),r.push(""),i.notes&&(r.push("> \u{1F4DD} "+i.notes),r.push("")),r.push("---"),r.push("");let o=t+" - \u573A\u666F\u5206\u955C.md";await this.app.vault.create(o,r.join(`
`)),new E.Notice("\u573A\u666F\u5206\u955C\u5DF2\u4FDD\u5B58: "+o);let n=this.app.vault.getAbstractFileByPath(o);n instanceof E.TFile&&await this.app.workspace.getLeaf().openFile(n)}async activateView(){let t=this.app.workspace.getLeavesOfType(re);if(t.length===0){let e=this.app.workspace.getRightLeaf(!1);e&&(await e.setViewState({type:re,active:!0}),this.app.workspace.revealLeaf(e))}else this.app.workspace.revealLeaf(t[0])}async loadSettings(){let t=await this.loadData()||{};this.settings=Object.assign({},ae,t),this.settings.defaultStyle=Object.assign({},ae.defaultStyle,t.defaultStyle||{})}async saveSettings(){await this.saveData(this.settings),this.pipeline.updateSettings(this.settings),this.coverGenerator.updateSettings(this.settings)}showCoverInputModal(t){let e=t||this.app.workspace.getActiveFile(),r="";e&&(r=e.basename.replace(/^\d{4}年\d{1,2}月\d{1,2}日[-_]/,"")),new Ae(this.app,r,async(o,n)=>{if(!o.trim()){new E.Notice("\u8BF7\u8F93\u5165\u5C01\u9762\u6587\u5B57");return}new E.Notice("\u{1F5BC}\uFE0F \u6B63\u5728\u751F\u6210\u5C01\u9762...");try{let i=await this.coverGenerator.generate(o.trim(),n==null?void 0:n.trim());new E.Notice(`\u2705 \u5C01\u9762\u5DF2\u751F\u6210: ${i}`,5e3);let c=this.app.vault.getAbstractFileByPath(i);c instanceof E.TFile&&await this.app.workspace.getLeaf().openFile(c)}catch(i){new E.Notice("\u5C01\u9762\u751F\u6210\u5931\u8D25: "+i.message)}}).open()}},Ae=class extends E.Modal{constructor(t,e,r){super(t);this.line1Text="";this.line2Text="";this.line1Bold="";this.line2Bold="";this.defaultTitle=e,this.line1Text=e,this.onSubmit=r}onOpen(){let{contentEl:t}=this;t.empty(),t.createEl("h2",{text:"\u{1F5BC}\uFE0F \u751F\u6210\u6587\u5B57\u5C01\u9762"}),new E.Setting(t).setName("\u7B2C\u4E00\u884C\u6587\u5B57").addText(e=>{e.setPlaceholder("\u514D\u8D39\u7528\u4E0AClaude"),e.setValue(this.defaultTitle),e.inputEl.style.width="100%",e.onChange(r=>this.line1Text=r),setTimeout(()=>e.inputEl.focus(),50)}),new E.Setting(t).setName("\u7B2C\u4E00\u884C\u52A0\u7C97\u5173\u952E\u8BCD").setDesc("\u7559\u7A7A\u5219\u6574\u884C\u7EC6\u4F53").addText(e=>{e.setPlaceholder("Claude"),e.inputEl.style.width="100%",e.onChange(r=>this.line1Bold=r)}),new E.Setting(t).setName("\u7B2C\u4E8C\u884C\u6587\u5B57\uFF08\u53EF\u7559\u7A7A\uFF09").addText(e=>{e.setPlaceholder("99%\u7684\u4EBA\u4E0D\u77E5\u9053"),e.inputEl.style.width="100%",e.onChange(r=>this.line2Text=r)}),new E.Setting(t).setName("\u7B2C\u4E8C\u884C\u52A0\u7C97\u5173\u952E\u8BCD").setDesc("\u7559\u7A7A\u5219\u6574\u884C\u7EC6\u4F53").addText(e=>{e.setPlaceholder("99%"),e.inputEl.style.width="100%",e.onChange(r=>this.line2Bold=r)}),new E.Setting(t).addButton(e=>e.setButtonText("\u751F\u6210\u5C01\u9762").setCta().onClick(()=>this.submit()))}markBold(t,e){return!e.trim()||!t.includes(e.trim())?t:t.replace(e.trim(),`**${e.trim()}**`)}submit(){let t=this.markBold(this.line1Text,this.line1Bold),e=this.markBold(this.line2Text,this.line2Bold);this.close(),this.onSubmit(t,e)}onClose(){this.contentEl.empty()}};
