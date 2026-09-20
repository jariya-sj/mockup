/* ========== Render ========== */
function render(){
  renderTopbar();
  const app=document.getElementById("app");
  if(state.role==="general"){app.innerHTML=generalView();return;}
  if(!state.loggedIn[state.role]){state.role="general";renderTopbar();app.innerHTML=generalView();return;}
  if(state.role==="student")app.innerHTML=studentView();
  else if(state.role==="enterprise")app.innerHTML=enterpriseView();
  else if(state.role==="institution")app.innerHTML=institutionView();
  else if(state.role==="admin")app.innerHTML=adminView();
}
render();
