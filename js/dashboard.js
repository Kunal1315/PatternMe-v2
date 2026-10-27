function initDashboard(){if(!pmRequireAuth())return;
    pmNav('dashboard');pmStartReminderChecks();
    
    const u=pmUser(),all=Object.entries(pmEntries()).sort((a,b)=>b[0].localeCompare(a[0])),week=all.filter(([d])=>{const x=new Date(d+'T12:00:00'),now=new Date();return (now-x)/86400000<7});
    document.getElementById('welcomeTitle').textContent=`Welcome back, ${u.name.split(' ')[0]}!`;
    document.getElementById('daysPill').textContent=`${all.length} check-in${all.length===1?'':'s'}`;
    document.getElementById('sleepMetric').textContent=week.length?pmAverage(week.map(x=>x[1]),'sleep').toFixed(1)+'h':'—';
    document.getElementById('studyMetric').textContent=week.length?pmAverage(week.map(x=>x[1]),'study').toFixed(1)+'h':'—';
    document.getElementById('screenMetric').textContent=week.length?pmAverage(week.map(x=>x[1]),'screen').toFixed(1)+'h':'—';
    const habits=pmHabits(),done=habits.filter(pmTodayDone).length;document.getElementById('habitsMetric').textContent=`${done}/${habits.length}`;
    document.getElementById('dashboardHabits').innerHTML=habits.length?habits.slice(0,5).map(h=>`<div class="habit-row mb-2 ${pmTodayDone(h)?'done':''}">
    <div class="habit-emoji">${pmEscape(h.emoji||'✨')}</div><div class="flex-grow-1"><div class="fw-bold habit-name">
    ${pmEscape(h.name)}</div><div class="reminder-time">${h.reminder?'Reminder '+h.reminder:'No reminder set'}</div></div><button class="btn btn-sm ${pmTodayDone(h)?'btn-outline-success':'btn-primary'}"
     onclick="pmToggleHabit('${h.id}')">${pmTodayDone(h)?'✓ Done':'Mark done'}</button></div>`).join(''):'<div class="empty-state"><div class="empty-icon">✦</div><strong>No habits yet</strong><p class="mb-3">Add a habit and choose a reminder time.</p><a class="btn btn-primary" href="habits.html">Create a habit</a></div>';document.getElementById('recentEntries').innerHTML=all.length?`<div class="table-responsive"><table class="table"><thead><tr><th>Date</th><th>Study</th><th>Mood</th></tr></thead><tbody>${all.slice(0,4).map(([d,v])=>`<tr><td>${pmFormatDate(d)}</td><td>${v.study}h</td><td>${pmEscape(v.mood)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted mb-0">No check-ins saved yet. Start with today.</p>';
     document.getElementById('quickInsight').textContent=pmInsights()[0]}
document.addEventListener('DOMContentLoaded',initDashboard);