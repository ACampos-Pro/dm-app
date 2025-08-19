import React, { useState } from "react";

const roles = [
  "Street Merc",
  "Hacker (Netrunner)",
  "Fixer",
  "Techie",
  "Face",
  "Nomad",
  "MedTech",
];

const weapons = ["Pistol", "Blade", "SMG", "Shotgun", "Hacking Deck"];
const cybernetics = [
  "Optical Enhancer",
  "Reflex Boosters",
  "Arm Blade",
  "Neural Jack",
  "Subdermal Armor",
];
const skills = [
  "Shooting",
  "Sneaking",
  "Driving",
  "Talking",
  "Fixing tech",
  "Hacking",
  "Healing",
  "Fighting",
  "Scamming",
  "Tracking",
];

function CharacterCreator({ initialName, onSubmit }) {
  const [form, setForm] = useState({
    name: initialName,
    alias: "",
    age: "",
    look: "",
    role: "",
    otherRole: "",
    stats: { grit: 0, reflex: 0, smarts: 0, charm: 0, cool: 0 },
    weapons: [],
    customWeapon: "",
    cybernetic: "",
    customCybernetic: "",
    gear: "",
    skills: [],
    background: {
      birthplace: "",
      hunter: "",
      secret: "",
      item: "",
    },
  });

  const [statPointsLeft, setStatPointsLeft] = useState(10);

  // Handle simple input changes
  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  // Handle nested background fields
  const handleBackgroundChange = (field) => (e) => {
    setForm((f) => ({
      ...f,
      background: { ...f.background, [field]: e.target.value },
    }));
  };

  // Handle stats with max and total 10 points
  const handleStatChange = (stat) => (e) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 0) val = 0;
    if (val > 5) val = 5;

    const otherStatsTotal =
      Object.entries(form.stats).reduce(
        (acc, [k, v]) => (k !== stat ? acc + v : acc),
        0
      ) + val;

    if (otherStatsTotal > 10) return; // exceed total points

    setForm((f) => ({ ...f, stats: { ...f.stats, [stat]: val } }));
    setStatPointsLeft(10 - otherStatsTotal);
  };

  // Toggle weapons (max 2)
  const toggleWeapon = (weapon) => {
    const hasWeapon = form.weapons.includes(weapon);
    let newWeapons;
    if (hasWeapon) {
      newWeapons = form.weapons.filter((w) => w !== weapon);
    } else {
      if (form.weapons.length >= 2) return; // max 2 weapons
      newWeapons = [...form.weapons, weapon];
    }
    setForm((f) => ({ ...f, weapons: newWeapons }));
  };

  // Toggle skills (max 2)
  const toggleSkill = (skill) => {
    const hasSkill = form.skills.includes(skill);
    let newSkills;
    if (hasSkill) {
      newSkills = form.skills.filter((s) => s !== skill);
    } else {
      if (form.skills.length >= 2) return;
      newSkills = [...form.skills, skill];
    }
    setForm((f) => ({ ...f, skills: newSkills }));
  };

  // Submit handler
  const handleSubmit = () => {
    // Validation: ensure required fields and stat points used
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!form.role && !form.otherRole.trim()) {
      alert("Please pick or enter a role");
      return;
    }
    if (statPointsLeft !== 0) {
      alert(`Please distribute all 10 stat points (left: ${statPointsLeft})`);
      return;
    }
    if (form.skills.length !== 2) {
      alert("Please choose exactly 2 skills");
      return;
    }
    // pass full form data back
    onSubmit(form);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial" }}>
      <h2>⚡ CYBERPUNK LITE CHARACTER SHEET ⚡</h2>

      <h3>🧑 Character Info</h3>
      <label>
        Name: <input value={form.name} readOnly />
      </label>
      <br />
      <label>
        Alias/Nickname:{" "}
        <input
          value={form.alias}
          onChange={handleChange("alias")}
          placeholder="Alias or nickname"
        />
      </label>
      <br />
      <label>
        Age:{" "}
        <input
          type="number"
          min="0"
          value={form.age}
          onChange={handleChange("age")}
          style={{ width: 60 }}
        />
      </label>
      <br />
      <label>
        Look (describe clothes, cybernetics, style):<br />
        <textarea
          value={form.look}
          onChange={handleChange("look")}
          rows={3}
          style={{ width: "100%" }}
        />
      </label>

      <h3>🛠️ ROLE / ARCHETYPE</h3>
      <p>Pick one (or write your own):</p>
      {roles.map((r) => (
        <label key={r} style={{ display: "block" }}>
          <input
            type="radio"
            name="role"
            value={r}
            checked={form.role === r}
            onChange={handleChange("role")}
          />{" "}
          {r}
        </label>
      ))}
      <label>
        Other:{" "}
        <input
          value={form.otherRole}
          onChange={handleChange("otherRole")}
          placeholder="Custom role"
        />
      </label>

      <h3>📊 STATS (1-5 scale, distribute 10 points total)</h3>
      <p>Points left: {statPointsLeft}</p>
      {Object.entries(form.stats).map(([stat, val]) => (
        <label key={stat} style={{ display: "block" }}>
          {stat.charAt(0).toUpperCase() + stat.slice(1)}:{" "}
          <input
            type="number"
            min="0"
            max="5"
            value={val}
            onChange={handleStatChange(stat)}
            style={{ width: 60 }}
          />
        </label>
      ))}

      <h3>🧰 GEAR</h3>
      <p>Pick or write in 1-2 weapons:</p>
      {weapons.map((w) => (
        <label key={w} style={{ display: "inline-block", width: "48%" }}>
          <input
            type="checkbox"
            checked={form.weapons.includes(w)}
            onChange={() => toggleWeapon(w)}
            disabled={
              !form.weapons.includes(w) && form.weapons.length >= 2
            }
          />{" "}
          {w}
        </label>
      ))}
      <br />
      <label>
        Custom Weapon:{" "}
        <input
          value={form.customWeapon}
          onChange={handleChange("customWeapon")}
          placeholder="Custom weapon"
        />
      </label>

      <p>Pick one cybernetic:</p>
      {cybernetics.map((c) => (
        <label key={c} style={{ display: "block" }}>
          <input
            type="radio"
            name="cybernetic"
            value={c}
            checked={form.cybernetic === c}
            onChange={handleChange("cybernetic")}
          />{" "}
          {c}
        </label>
      ))}
      <label>
        Custom Cybernetic:{" "}
        <input
          value={form.customCybernetic}
          onChange={handleChange("customCybernetic")}
          placeholder="Custom cybernetic"
        />
      </label>

      <p>Gear/Item (optional flair):</p>
      <input
        value={form.gear}
        onChange={handleChange("gear")}
        placeholder="Gear or item"
        style={{ width: "100%" }}
      />

      <h3>🎯 SKILLS (choose 2)</h3>
      {skills.map((s) => (
        <label key={s} style={{ display: "inline-block", width: "48%" }}>
          <input
            type="checkbox"
            checked={form.skills.includes(s)}
            onChange={() => toggleSkill(s)}
            disabled={
              !form.skills.includes(s) && form.skills.length >= 2
            }
          />{" "}
          {s}
        </label>
      ))}

      <h3>🧬 BACKGROUND BUILDER</h3>
      <p>Where were you born?</p>
      {[
        "Mega-city slums",
        "Corporate enclave",
        "Nomad convoy",
        "Experimental lab",
      ].map((opt) => (
        <label key={opt} style={{ display: "block" }}>
          <input
            type="radio"
            name="birthplace"
            value={opt}
            checked={form.background.birthplace === opt}
            onChange={handleBackgroundChange("birthplace")}
          />{" "}
          {opt}
        </label>
      ))}

      <p>Someone is hunting you. Who is it?</p>
      {[
        "A bounty hunter with your name tattooed on their arm",
        "An ex-lover turned corporate assassin",
        "The gang you betrayed",
        "Yourself — or at least a clone of you",
      ].map((opt) => (
        <label key={opt} style={{ display: "block" }}>
          <input
            type="radio"
            name="hunter"
            value={opt}
            checked={form.background.hunter === opt}
            onChange={handleBackgroundChange("hunter")}
          />{" "}
          {opt}
        </label>
      ))}

      <p>What’s the one thing you can’t let anyone find out?</p>
      {[
        "You used to be a corp asset",
        "You leaked sensitive data",
        "You’re infected with experimental tech",
        "You caused a massacre, directly or indirectly",
      ].map((opt) => (
        <label key={opt} style={{ display: "block" }}>
          <input
            type="radio"
            name="secret"
            value={opt}
            checked={form.background.secret === opt}
            onChange={handleBackgroundChange("secret")}
          />{" "}
          {opt}
        </label>
      ))}

      <p>What valuable item are you hiding?</p>
      {[
        "A chip with the location of a hidden vault",
        "A prototype cyberware nobody else has",
        "An old-school data cassette with forbidden knowledge",
        "A child (biological or synthetic) that everyone’s after",
      ].map((opt) => (
        <label key={opt} style={{ display: "block" }}>
          <input
            type="radio"
            name="item"
            value={opt}
            checked={form.background.item === opt}
            onChange={handleBackgroundChange("item")}
          />{" "}
          {opt}
        </label>
      ))}

      <br />
      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Create Character
      </button>
    </div>
  );
}

export default CharacterCreator;
