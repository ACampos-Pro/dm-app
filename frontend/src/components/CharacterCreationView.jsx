import React, { useState } from 'react';

const STAT_DESCRIPTIONS = {
    grit: 'Grit (Health, physical toughness)',
    reflex: 'Reflex (Speed, combat, driving)',
    smarts: 'Smarts (Tech, hacking, tactics)',
    charm: 'Charm (Persuasion, disguise, lying)',
    cool: 'Cool (Nerves, stealth, composure)'
};

const CharacterCreationView = ({ initialData, socket }) => {
    const [sheet, setSheet] = useState({
        info: { name: initialData.playerName || '', alias: '', age: '', look: '', gold: 0 },
        role: 'Street Merc',
        stats: { grit: 1, reflex: 1, smarts: 1, charm: 1, cool: 1 },
        skills: [],
        background: { birthplace: 'Mega-city slums', hunter: 'A bounty hunter' }
    });

    const handleInfoChange = e => setSheet(s => ({ ...s, info: { ...s.info, [e.target.name]: e.target.value } }));
    const handleStatChange = e => {
        const { name, value } = e.target;
        const newStatValue = Math.max(0, Math.min(5, parseInt(value) || 0));
        const oldStatValue = sheet.stats[name];
        const pointDifference = newStatValue - oldStatValue;
        const currentTotalPoints = Object.values(sheet.stats).reduce((sum, val) => sum + val, 0);
        if (pointDifference > 0 && currentTotalPoints + pointDifference > 10) {
            return;
        }
        setSheet(s => ({ ...s, stats: { ...s.stats, [name]: newStatValue } }));
    };
    const handleRadioChange = e => setSheet(s => ({ ...s, [e.target.name]: e.target.value }));
    const handleBackgroundChange = e => setSheet(s => ({ ...s, background: { ...s.background, [e.target.name]: e.target.value } }));
    const handleSkillChange = e => {
        const { value, checked } = e.target;
        setSheet(s => {
            const newSkills = checked ? [...s.skills, value] : s.skills.filter(skill => skill !== value);
            return { ...s, skills: newSkills.length > 2 ? s.skills : newSkills };
        });
    };
    const totalStatPoints = Object.values(sheet.stats).reduce((sum, val) => sum + val, 0);
    const remainingPoints = 10 - totalStatPoints;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (remainingPoints !== 0) {
            alert(`You must distribute exactly 10 points. You have ${remainingPoints} points left to assign.`);
            return;
        }
        if (sheet.skills.length !== 2) {
            alert('You must choose exactly 2 skills.');
            return;
        }
        socket.emit('character:create', sheet);
    };
    const ROLES = ['Street Merc', 'Hacker (Netrunner)', 'Fixer', 'Techie', 'Face', 'Nomad', 'MedTech'];
    const SKILLS = ['Shooting', 'Sneaking', 'Driving', 'Talking', 'Fixing tech', 'Hacking', 'Healing', 'Fighting', 'Scamming', 'Tracking'];
    return (
        <div className="view">
            <h2>⚡ CYBERPUNK LITE CHARACTER SHEET ⚡</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>🧑 Character Info</legend>
                    <div className="form-grid">
                        <div><label>Name</label><input type="text" value={sheet.info.name} readOnly /></div>
                        <div><label>Alias/Nickname</label><input type="text" name="alias" value={sheet.info.alias} onChange={handleInfoChange} /></div>
                        <div><label>Age</label><input type="text" name="age" value={sheet.info.age} onChange={handleInfoChange} /></div>
                    </div>
                    <label>Look (describe clothes, cybernetics, style)</label>
                    <textarea name="look" value={sheet.info.look} onChange={handleInfoChange} rows="3"></textarea>
                </fieldset>
                <fieldset>
                    <legend>🛠️ ROLE / ARCHETYPE</legend>
                    <div className="radio-group form-grid">
                        {ROLES.map(r => <label key={r}><input type="radio" name="role" value={r} checked={sheet.role === r} onChange={handleRadioChange} />{r}</label>)}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>📊 STATS (Distribute 10 points, max 5 per stat)</legend>
                    <p>Points Remaining: <strong style={{color: remainingPoints === 0 ? '#a6e3a1' : '#f38ba8'}}>{remainingPoints}</strong></p>
                    <div className="form-grid">
                        {Object.keys(sheet.stats).map(stat => (
                            <div key={stat}>
                                <label>{STAT_DESCRIPTIONS[stat]}</label>
                                <input type="number" name={stat} value={sheet.stats[stat]} onChange={handleStatChange} min="0" max="5" />
                            </div>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>🎯 SKILLS (Choose {2 - sheet.skills.length} more)</legend>
                     <div className="checkbox-group form-grid">
                        {SKILLS.map(skill => <label key={skill}><input type="checkbox" value={skill} checked={sheet.skills.includes(skill)} onChange={handleSkillChange} disabled={sheet.skills.length >= 2 && !sheet.skills.includes(skill)} />{skill}</label>)}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>🧬 BACKGROUND BUILDER</legend>
                     <label>Where were you born?</label>
                     <select name="birthplace" value={sheet.background.birthplace} onChange={handleBackgroundChange} style={{width: '100%', padding: '12px', marginBottom: '1rem'}} >
                        <option>Mega-city slums</option><option>Corporate enclave</option><option>Nomad convoy</option><option>Experimental lab</option>
                     </select>
                     <label>Who is hunting you?</label>
                     <select name="hunter" value={sheet.background.hunter} onChange={handleBackgroundChange} style={{width: '100%', padding: '12px', marginBottom: '1rem'}}>
                        <option>A bounty hunter</option><option>An ex-lover</option><option>The gang you betrayed</option><option>A clone of you</option>
                     </select>
                </fieldset>
                <button type="submit" disabled={remainingPoints !== 0 || sheet.skills.length !== 2}>Confirm Character</button>
            </form>
        </div>
    );
};

export default CharacterCreationView;
