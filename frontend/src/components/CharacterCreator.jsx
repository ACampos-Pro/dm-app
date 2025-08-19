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

const roleTooltips = {
  "Street Merc": `Street Merc

💪 Advantage:
Always ready for a fight — +1 on any combat roll when using guns or melee weapons.
Can intimidate low-level gangers and petty criminals without a roll.
Knows black market arms dealers — can find weapons faster/cheaper than others.

⚠ Disadvantage:
Not subtle — Stealth attempts are always made at disadvantage.
Loud reputation — Enemies are more likely to target or challenge you.
Overly direct — struggles with complex tech or hacking challenges.`,
};

const weapons = ["Pistol", "Blade", "SMG", "Shotgun", "Hacking Deck"];
const gearOptions = [
  "Medkit",
  "Lockpick Set",
  "EMP Grenade",
  "Holo Projector",
  "Armor Vest",
  "Data Chip",
  "Stim Pack",
  "Grapple Hook",
];
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
    stats: { grit: 0, reflex: 0, smarts: 0, charm: 0, cool: 0 },
    weapons: [],
    cybernetic: "",
    gear: [],
    skills: [],
    background: {
      birthplace: "",
      hunter: "",
      secret: "",
      item: "",
    },
  });

  const [statPointsLeft, setStatPointsLeft] = useState(10);
  const [hoveredRole, setHoveredRole] = useState(null);

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

  // Toggle gear (max 2)
  const toggleGear = (gear) => {
    const hasGear = form.gear.includes(gear);
    let newGear;
    if (hasGear) {
      newGear = form.gear.filter((g) => g !== gear);
    } else {
      if (form.gear.length >= 2) return; // max 2 gear
      newGear = [...form.gear, gear];
    }
    setForm((f) => ({ ...f, gear: newGear }));
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
    if (!form.role) {
      alert("Please pick a role");
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
    if (form.weapons.length === 0) {
      alert("Please choose at least 1 weapon");
      return;
    }
    if (!form.cybernetic) {
      alert("Please choose a cybernetic");
      return;
    }
    if (form.gear.length === 0) {
      alert("Please choose at least 1 gear item");
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
      <p>Pick one:</p>
      <div>
        {roles.map((r) => (
          <label
            key={r}
            style={{ display: "block", position: "relative" }}
            onMouseEnter={() => setHoveredRole(r)}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <input
              type="radio"
              name="role"
              value={r}
              checked={form.role === r}
              onChange={handleChange("role")}
            />{" "}
            {r}
            {hoveredRole === r && roleTooltips[r] && (
              <div
                style={{
                  position: "absolute",
                  left: "110%",
                  top: 0,
                  background: "#181825",
                  color: "#cdd6f4",
                  border: "1px solid #45475a",
                  borderRadius: 8,
                  padding: "1rem",
                  width: 320,
                  zIndex: 10,
                  whiteSpace: "pre-line",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                {roleTooltips[r]}
              </div>
            )}
          </label>
        ))}
      </div>

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

      <h3>🧰 WEAPONS (Pick up to 2)</h3>
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

      <h3>🎒 GEAR (Pick up to 2)</h3>
      {gearOptions.map((g) => (
        <label key={g} style={{ display: "inline-block", width: "48%" }}>
          <input
            type="checkbox"
            checked={form.gear.includes(g)}
            onChange={() => toggleGear(g)}
            disabled={
              !form.gear.includes(g) && form.gear.length >= 2
            }
          />{" "}
          {g}
        </label>
      ))}

      <h3>🦾 CYBERNETICS (Pick one)</h3>
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
