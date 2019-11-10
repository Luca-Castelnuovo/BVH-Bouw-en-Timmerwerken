"use strict";var sgMail=require("@sendgrid/mail"),Recaptcha=require("google-recaptcha"),_require=require("./validations"),validateEmail=_require.validateEmail,validateLength=_require.validateLength;exports.handler=function(e,a,t){if(!process.env.CONTACT_EMAIL)return t(null,{statusCode:500,body:"process.env.CONTACT_EMAIL must be defined"});if(!process.env.SENDGRID_KEY)return t(null,{statusCode:500,body:"process.env.SENDGRID_KEY must be defined"});if(!process.env.RECAPTCHA_KEY)return t(null,{statusCode:500,body:"process.env.RECAPTCHA_KEY must be defined"});sgMail.setApiKey(process.env.SENDGRID_KEY);var s=new Recaptcha({secret:process.env.RECAPTCHA_KEY}),r=JSON.parse(e.body);try{validateLength("body.g-recaptcha-response",r["g-recaptcha-response"],256,1024)}catch(e){return t(null,{statusCode:403,body:e.message})}try{validateLength("body.name",r.name,3,50)}catch(e){return t(null,{statusCode:403,body:e.message})}try{validateEmail("body.email",r.email)}catch(e){return t(null,{statusCode:403,body:e.message})}try{validateLength("body.details",r.details,3,1e3)}catch(e){return t(null,{statusCode:403,body:e.message})}var n={to:process.env.CONTACT_EMAIL,from:"no-reply@lucacastelnuovo.nl",templateId:"d-86909c9d9dba4678a154c4dcde3667cf",dynamic_template_data:{name:r.name,email:r.email,details:r.details}};s.verify({response:r["g-recaptcha-response"]},(function(e){e&&t(null,{statusCode:500,body:e})})),sgMail.send(n).then((function(){return t(null,{statusCode:200,body:""})})).catch((function(e){return t(null,{statusCode:500,body:e.message})}))};