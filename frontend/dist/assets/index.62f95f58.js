import{c as d}from"./vendor.4729cc7b.js";const l=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}};l();const i=document.getElementById("submit-form"),u=document.getElementById("submit-btn"),a=document.getElementById("longURL"),m=document.getElementById("some-issue"),f=document.getElementById("success-card"),p=document.getElementById("copy-btn"),y=document.getElementById("shortened-div");i.addEventListener("submit",async r=>{r.preventDefault(),u.disabled=!0;const o=await fetch("/api/shorten",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({longURL:a.value})});if(i.classList.add("d-none"),!o.ok)m.classList.remove("d-none");else{const n=await o.json();y.innerText=`Shortned URL: https://pops.gq/${n.shortURL}`,p.onclick=()=>{d(`https://pops.gq/${n.shortURL}`)},f.classList.remove("d-none")}});