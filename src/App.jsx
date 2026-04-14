import { useState, useEffect, useRef } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f6f9; font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #dde1e7; border-radius: 4px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px #bbf7d0; } 50% { box-shadow: 0 0 0 7px #dcfce7; } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id:1, type:"sale", address:"4821 Magnolia Creek Dr", city:"Austin, TX", zip:"78745", price:549000, beds:4, baths:3, sqft:2340, source:"Listing Network", daysAgo:1, lat:30.22, lng:-97.78, img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80", likes:34, tag:"New Listing", tagColor:"#16a34a", hood:"South Congress", comments:[{id:1,user:"Marcus T.",av:"M",time:"2h ago",text:"Backyard looks massive for Austin. Anyone know the lot size?",likes:5,roleLabel:"🏠 Potential Buyer"},{id:2,user:"Priya N.",av:"P",time:"1h ago",text:"Kitchen was just renovated — looks really clean!",likes:3}] },
  { id:2, type:"sale", address:"112 Lakeview Terrace", city:"Atlanta, GA", zip:"30305", price:875000, beds:5, baths:4, sqft:3800, source:"Listing Network", daysAgo:0, lat:33.85, lng:-84.39, img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80", likes:61, tag:"Just Listed", tagColor:"#2563eb", hood:"Buckhead", comments:[{id:1,user:"Dana W.",av:"D",time:"45m ago",text:"Schools here are A-rated. Great value for Buckhead.",likes:12,roleLabel:"👋 Neighbor"}] },
  { id:3, type:"sale", address:"893 Coastal Ridge Blvd", city:"Tampa, FL", zip:"33602", price:415000, beds:3, baths:2, sqft:1780, source:"Listing Network", daysAgo:2, lat:27.95, lng:-82.46, img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80", likes:19, tag:"Price Drop", tagColor:"#dc2626", hood:"Downtown Tampa", comments:[] },
  { id:4, type:"sale", address:"2204 Stonebrook Lane", city:"Charlotte, NC", zip:"28277", price:689000, beds:4, baths:3.5, sqft:3100, source:"Listing Network", daysAgo:1, lat:35.05, lng:-80.79, img:"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=700&q=80", likes:47, tag:"New Listing", tagColor:"#16a34a", hood:"Ballantyne", comments:[{id:1,user:"James R.",av:"J",time:"3h ago",text:"HOA is $180/mo but includes pool & tennis. Worth it.",likes:8},{id:2,user:"Tasha M.",av:"T",time:"2h ago",text:"Toured this — ceilings are gorgeous, very quiet street.",likes:14,roleLabel:"🏠 Potential Buyer"}] },
  { id:5, type:"sale", address:"517 Elmwood Park Ct", city:"Denver, CO", zip:"80203", price:760000, beds:4, baths:3, sqft:2890, source:"Listing Network", daysAgo:0, lat:39.74, lng:-104.99, img:"https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=700&q=80", likes:52, tag:"Just Listed", tagColor:"#2563eb", hood:"Capitol Hill", comments:[{id:1,user:"Lena K.",av:"L",time:"1h ago",text:"Views of the Rockies from the back deck. Yes please!",likes:9}] },
  { id:6, type:"sale", address:"3311 Harbor Oaks Dr", city:"Houston, TX", zip:"77019", price:1100000, beds:6, baths:5, sqft:5200, source:"Listing Network", daysAgo:3, lat:29.76, lng:-95.37, img:"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80", likes:88, tag:"Open House", tagColor:"#7c3aed", hood:"River Oaks", comments:[{id:1,user:"Brent A.",av:"B",time:"5h ago",text:"River Oaks never disappoints. This one is especially sharp.",likes:21,roleLabel:"💼 Investor"},{id:2,user:"Sofia R.",av:"S",time:"2h ago",text:"Price/sqft is actually competitive for this area.",likes:17}] },
  { id:7, type:"rent", address:"310 W 85th St, Apt 4C", city:"New York, NY", zip:"10024", price:3200, beds:1, baths:1, sqft:720, source:"Rental Network", daysAgo:0, lat:40.785, lng:-73.978, img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80", likes:41, tag:"For Rent", tagColor:"#ea580c", hood:"Upper West Side", comments:[
    {id:1, user:"Keisha T.", av:"K", time:"3h ago",   text:"Lived in this building 2 years — super responsive landlord. Heat works great, no bugs, zero pest issues.", likes:18, roleLabel:"🗝️ Current Tenant", verified:true},
    {id:2, user:"Nate G.",   av:"N", time:"5h ago",   text:"Is street parking even possible on this block? I have a car and that's a dealbreaker for me.", likes:4,  roleLabel:"🏠 Potential Buyer"},
    {id:3, user:"Amber R.",  av:"A", time:"8h ago",   text:"The super is incredibly responsive. Maintenance requests get handled within 24 hours, sometimes same day. Rare for NYC.", likes:22, roleLabel:"🏢 Past Tenant", verified:true},
    {id:4, user:"Devon R.",  av:"D", time:"10h ago",  text:"Noise level is surprisingly low for being this close to Broadway. Double pane windows do a lot of work.", likes:11, roleLabel:"👋 Neighbor"},
    {id:5, user:"Lena K.",   av:"L", time:"12h ago",  text:"Hot water pressure is strong and consistent. Never had an issue in 18 months here.", likes:9,  roleLabel:"🗝️ Current Tenant", verified:true},
    {id:6, user:"Chris V.",  av:"C", time:"1 day ago",text:"Careful — the laundry room is only open 8am to 10pm. Annoying if you work late shifts.", likes:14, roleLabel:"🏢 Past Tenant", verified:true},
    {id:7, user:"Sofia R.",  av:"S", time:"1 day ago",text:"Pet friendly! My dog has lived here with no issues. They do charge a one-time pet deposit though.", likes:17, roleLabel:"🗝️ Current Tenant", verified:true},
    {id:8, user:"Marcus T.", av:"M", time:"2 days ago",text:"Is there an elevator in the building? The listing doesn't mention it.", likes:3,  roleLabel:"🏠 Potential Buyer"},
    {id:9, user:"Keisha T.", av:"K", time:"2 days ago",text:"Yes there's an elevator — it's small but works fine. Building has 6 floors.", likes:8,  roleLabel:"🗝️ Current Tenant", verified:true},
    {id:10,user:"Jordan M.", av:"J", time:"3 days ago",text:"The neighborhood is fantastic. Riverside Park is literally 2 blocks away — perfect if you run or have a dog.", likes:21, roleLabel:"👋 Neighbor"},
    {id:11,user:"Tyrese W.", av:"T", time:"3 days ago",text:"Anyone know if they allow sublets? I travel for work and may need to sublet for a few months.", likes:6,  roleLabel:"🏠 Potential Buyer"},
    {id:12,user:"Amber R.",  av:"A", time:"4 days ago",text:"No sublets allowed — checked when I was there. Landlord was firm on it. Something to keep in mind.", likes:12, roleLabel:"🏢 Past Tenant", verified:true},
  ]},
  { id:8, type:"rent", address:"57 Driggs Ave, Unit 2R", city:"New York, NY", zip:"11211", price:2800, beds:1, baths:1, sqft:650, source:"Rental Network", daysAgo:1, lat:40.716, lng:-73.951, img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80", likes:29, tag:"For Rent", tagColor:"#ea580c", hood:"Williamsburg", comments:[{id:1,user:"Amber R.",av:"A",time:"5h ago",text:"Landlord took 6 weeks to fix the heat last winter. Think twice.",likes:31,roleLabel:"🏢 Past Tenant",verified:true,anonymous:false, officialResponse:{ text:"Hi — thank you for sharing this. We take heating issues seriously and we're sorry for the delay you experienced. We've since upgraded our HVAC vendor and response times are now under 48 hours. We'd welcome the chance to speak with you directly.", time:"3h ago", manager:"David Park · Park Property Group" }},{id:2,user:"Chris V.",av:"C",time:"2h ago",text:"Neighborhood is amazing though — L train is right there.",likes:9}] },
  { id:9, type:"rent", address:"142 Montague St, Apt 8", city:"New York, NY", zip:"11201", price:3800, beds:2, baths:1, sqft:900, source:"Rental Network", daysAgo:0, lat:40.694, lng:-73.994, img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80", likes:55, tag:"Just Listed", tagColor:"#2563eb", hood:"Brooklyn Heights", comments:[{id:1,user:"Sofia R.",av:"S",time:"1h ago",text:"Brooklyn Heights is one of the best kept secrets. This price is actually fair for the area.",likes:22}] },
  { id:10, type:"rent", address:"2241 Frederick Douglass Blvd, 3F", city:"New York, NY", zip:"10027", price:2400, beds:1, baths:1, sqft:600, source:"Rental Network", daysAgo:2, lat:40.804, lng:-73.954, img:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80", likes:37, tag:"Price Drop", tagColor:"#dc2626", hood:"Harlem", comments:[{id:1,user:"Marcus T.",av:"M",time:"4h ago",text:"Harlem is having a real moment right now. Great restaurants on this block.",likes:14},{id:2,user:"Priya N.",av:"P",time:"2h ago",text:"Management company is responsive — I have a friend in this building.",likes:8}] },
  { id:11, type:"rent", address:"88 E 3rd St, Apt 5A", city:"New York, NY", zip:"10003", price:3500, beds:1, baths:1, sqft:680, source:"Rental Network", daysAgo:0, lat:40.726, lng:-73.989, img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80", likes:63, tag:"Just Listed", tagColor:"#2563eb", hood:"East Village", comments:[{id:1,user:"Devon R.",av:"D",time:"30m ago",text:"East Village walkability is unmatched. Everything is 5 mins away.",likes:19},{id:2,user:"Lena K.",av:"L",time:"15m ago",text:"Noise level on this street is real though — ask about window quality.",likes:11}] },
  { id:12, type:"rent", address:"415 Edgecombe Ave, 6D", city:"New York, NY", zip:"10031", price:1950, beds:1, baths:1, sqft:580, source:"Rental Network", daysAgo:1, lat:40.824, lng:-73.941, img:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=80", likes:44, tag:"For Rent", tagColor:"#ea580c", hood:"Washington Heights", comments:[{id:1,user:"James R.",av:"J",time:"6h ago",text:"Best value in Manhattan right now. A train gets you to midtown in 20 mins.",likes:27},{id:2,user:"Tasha M.",av:"T",time:"3h ago",text:"Landlord is old school but fixes things fast. Been here 3 years.",likes:15,roleLabel:"🗝️ Current Tenant"}] },
];

// Mock user profiles showing broker status — visible only to agents/brokers
const MOCK_BUYER_PROFILES = [
  { id:1, name:"Jordan Mitchell", av:"J", location:"Bronx, NY",           propertyType:"Buy",  timeline:"3–6 months", preApproval:"In progress", hasAgent:true,  agentName:"Sandra Lee",  hasBroker:false },
  { id:2, name:"Tyrese Walker",   av:"T", location:"Brooklyn, NY",        propertyType:"Buy",  timeline:"1–3 months", preApproval:"Not yet",      hasAgent:false, agentName:null,          hasBroker:false },
  { id:3, name:"Camille Torres",  av:"C", location:"Upper West Side, NY", propertyType:"Rent", timeline:"ASAP",       preApproval:"N/A",          hasAgent:false, agentName:null,          hasBroker:false },
  { id:4, name:"Nate G.",         av:"N", location:"Harlem, NY",          propertyType:"Buy",  timeline:"3–6 months", preApproval:"Not yet",      hasAgent:false, agentName:null,          hasBroker:false },
  { id:5, name:"Devon R.",        av:"D", location:"Astoria, NY",         propertyType:"Buy",  timeline:"6–12 months",preApproval:"Not yet",      hasAgent:false, agentName:null,          hasBroker:false },
  { id:6, name:"Keisha T.",       av:"K", location:"Jersey City, NJ",     propertyType:"Buy",  timeline:"1–3 months", preApproval:"In progress",  hasAgent:true,  agentName:"Devon Reyes", hasBroker:false },
  { id:7, name:"Sofia R.",        av:"S", location:"Williamsburg, NY",    propertyType:"Rent", timeline:"ASAP",       preApproval:"N/A",          hasAgent:false, agentName:null,          hasBroker:false },
  { id:8, name:"Marcus T.",       av:"M", location:"Washington Heights",  propertyType:"Buy",  timeline:"3–6 months", preApproval:"In progress",  hasAgent:true,  agentName:"Sandra Lee",  hasBroker:false },
];

const CITIES = ["All Cities","Austin, TX","Atlanta, GA","Tampa, FL","Charlotte, NC","Denver, CO","Houston, TX","New York, NY"];
const TYPES = ["All","For Sale","For Rent"];
const SORTS = ["Newest","Most Liked","Price: Low→High","Price: High→Low"];
const AV_BG = {M:"#6366f1",P:"#ec4899",D:"#f59e0b",J:"#10b981",T:"#3b82f6",C:"#8b5cf6",L:"#06b6d4",B:"#f97316",S:"#14b8a6",Y:"#2563eb",A:"#22c55e",G:"#64748b",K:"#a855f7",N:"#0ea5e9"};

// Account types
const ACCOUNT_TYPES = [
  { value:"buyer",      label:"🏘️ Resident, Buyer or Renter",  desc:"Browse, comment as a neighbor, resident, or active searcher", color:"#2563eb" },
  { value:"agent",      label:"🤝 Real Estate Agent",          desc:"Professional agent account with lead access",      color:"#16a34a" },
  { value:"broker",     label:"🏦 Mortgage Broker",            desc:"Access buyer mortgage status and leads",           color:"#7c3aed" },
  { value:"landlord",   label:"🏠 Individual Landlord",        desc:"Own 1–2 properties · Free · Verify & respond",    color:"#ea580c" },
  { value:"management", label:"🏢 Property Management Co.",    desc:"Manage multiple properties · Paid plans",          color:"#dc2626" },
];

const BROKER_TIERS = [
  { value:"starter", label:"Starter", price:"$49/mo",  features:["Broker profile on platform","Visible to users without a broker"] },
  { value:"pro",     label:"Pro",     price:"$149/mo", features:["Everything in Starter","Lead feed dashboard","Contact buyers & agents"], popular:true },
  { value:"premium", label:"Premium", price:"$299/mo", features:["Everything in Pro","Priority placement","Featured badge","Profile analytics"] },
];

const AGENT_TIERS = [
  { value:"starter", label:"Starter", price:"$49/mo",  features:["Agent profile & badge on comments","Searchable by license number"] },
  { value:"pro",     label:"Pro",     price:"$99/mo",  features:["Everything in Starter","Appear in buyer agent lookup","Client dashboard","Notified when buyer links to you"], popular:true },
  { value:"premium", label:"Premium", price:"$199/mo", features:["Everything in Pro","Priority placement in search","Featured badge","Profile analytics"] },
];

const MANAGEMENT_TIERS = [
  { value:"starter",    label:"Starter",    price:"$29/mo",  features:["Claim up to 3 listings","Official response badge","Comment notifications"] },
  { value:"pro",        label:"Pro",        price:"$79/mo",  features:["Everything in Starter","Up to 20 listings","Response analytics","Sentiment overview"], popular:true },
  { value:"enterprise", label:"Enterprise", price:"$199/mo", features:["Everything in Pro","Unlimited listings","Portfolio dashboard","Bulk response tools"] },
];

// Individual landlords are always free
const LANDLORD_FREE_FEATURES = [
  "Claim up to 2 listings · Always free",
  "Official 🏠 Landlord response badge",
  "Comment notifications on your properties",
  "One-time ownership verification per listing",
];

// Mock agent directory for buyer lookup
const MOCK_AGENTS = [
  { id:1, name:"Sandra Lee", av:"S", license:"NY-1042873", brokerage:"Compass NYC", city:"New York, NY", specialty:"Buyer's Agent", rating:4.9, reviews:87 },
  { id:2, name:"Marcus Hill", av:"M", license:"NY-2931045", brokerage:"Keller Williams NYC", city:"New York, NY", specialty:"Luxury Residential", rating:4.8, reviews:63 },
  { id:3, name:"Devon Reyes", av:"D", license:"TX-8847291", brokerage:"Realty Austin", city:"Austin, TX", specialty:"First-Time Buyers", rating:5.0, reviews:41 },
  { id:4, name:"Keisha Thompson", av:"K", license:"GA-3021984", brokerage:"Atlanta Fine Homes", city:"Atlanta, GA", specialty:"Relocation", rating:4.7, reviews:55 },
];

// ─── DEMO ACCOUNTS ────────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = {
  agent: {
    name:"Sandra Lee", email:"sandra@compass.com", av:"S", city:"New York, NY",
    accountType:"agent", licenseNum:"NY-1042873", agentBrokerage:"Compass NYC",
    agentTier:"pro", photoPreview:null,
    bio:"Licensed real estate agent with 8 years helping buyers and renters navigate NYC. Compass NYC · License NY-1042873. Straightforward, honest, and always in your corner.",
    updates:[
      {
        id:1,
        text:"Harlem is one of the most undervalued neighborhoods in Manhattan right now. Pre-war buildings, wide streets, and genuine community energy. If you're open to it — I'd seriously explore it before everyone else catches on. Happy to answer any questions.",
        time:"1 day ago", likes:18,
        replies:[
          { id:101, av:"N", name:"Nate G.", time:"1 day ago", text:"I've been sleeping on Harlem honestly. What's the average 2BR going for right now in that area?" },
          { id:102, av:"K", name:"Keisha T.", time:"23h ago", text:"This is exactly the kind of insight I needed. I moved here from Atlanta and had no idea where to even start looking." },
          { id:103, av:"T", name:"Tyrese W.", time:"20h ago", text:"Sandra I love your updates — you actually give real info, not just generic advice. I've been searching in Brooklyn but would love your take on my situation. Would you be open to sending me an agent request? I'd love to have you in my corner." },
          { id:104, av:"S", name:"Sandra Lee", time:"18h ago", text:"Of course Tyrese — I just sent you a request through the app! Let's connect and find you something great. 🏠" },
        ]
      },
      {
        id:2,
        text:"Quick tip for first-time buyers in NYC: get your pre-approval letter BEFORE you start touring. Sellers won't take you seriously without it, and in this market a good listing can go in 48 hours. I recommend getting it even if you're 3–6 months out — it costs nothing and tells you exactly what you can afford.",
        time:"4 days ago", likes:31,
        replies:[
          { id:201, av:"M", name:"Marcus T.", time:"4 days ago", text:"This is so helpful. I didn't know you could get pre-approved that early. Does it affect your credit score?" },
          { id:202, av:"S", name:"Sandra Lee", time:"4 days ago", text:"Great question Marcus — a pre-approval does involve a hard inquiry but it only affects your score by a few points and stays on record for 90 days. Worth it for the leverage it gives you." },
          { id:203, av:"A", name:"Aisha L.", time:"3 days ago", text:"Can confirm this advice is golden. Sandra told me the same thing months ago and being pre-approved is the reason we got our place over two other offers." },
          { id:204, av:"D", name:"Devon R.", time:"3 days ago", text:"Do you work with buyers outside of Manhattan? I'm looking at parts of Brooklyn and Queens." },
          { id:205, av:"S", name:"Sandra Lee", time:"3 days ago", text:"Yes! I cover all five boroughs. Feel free to message me Devon — always happy to chat." },
        ]
      },
      {
        id:3,
        text:"Something I always tell my clients: visit a listing at different times of day. A street that feels peaceful at 2pm can feel completely different at 10pm — or vice versa. It takes an extra trip but it could save you years of regret. The neighborhood is just as much of the decision as the apartment itself.",
        time:"1 week ago", likes:44,
        replies:[
          { id:301, av:"C", name:"Camille T.", time:"1 week ago", text:"This is such practical advice. I wish I'd done this before signing my last lease. Lesson learned the hard way." },
          { id:302, av:"L", name:"Lena K.", time:"6 days ago", text:"Also visit on a weekend morning! Completely different vibe than a weekday afternoon showing." },
          { id:303, av:"N", name:"Nate G.", time:"6 days ago", text:"Sandra do you ever do neighborhood walk-arounds with clients before they commit to an area? That would be incredibly helpful." },
          { id:304, av:"S", name:"Sandra Lee", time:"6 days ago", text:"I do this all the time actually — it's one of my favorite parts of the process. Message me and we can set something up! 🗺️" },
        ]
      },
    ],
    linkedBuyers:[
      { id:1, name:"Jordan Mitchell", av:"J", location:"Bronx, NY", propertyType:"Buy", timeline:"3–6 months", preApproval:"In progress", hasBroker:false, hasLinkedAgent:true, agentName:"Sandra Lee", savedListings:3, lastActive:"2h ago" },
      { id:2, name:"Aisha Lewis", av:"A", location:"Queens, NY", propertyType:"Buy", timeline:"1–3 months", preApproval:"Approved", hasBroker:true, brokerName:"Robert Chen", brokerCompany:"Chase Home Lending", brokerPhone:"(212) 555-0198", hasLinkedAgent:true, agentName:"Sandra Lee", savedListings:7, lastActive:"30m ago" },
      { id:3, name:"Camille Torres", av:"C", location:"Upper West Side, NY", propertyType:"Rent", timeline:"ASAP", preApproval:"N/A", hasBroker:false, hasLinkedAgent:true, agentName:"Sandra Lee", savedListings:2, lastActive:"5h ago" },
    ],
    stats:{ linkedBuyers:3, profileViews:142, commentLikes:89, searchAppearances:34 },
  },
  broker: {
    name:"Robert Chen", email:"robert@chase.com", av:"R", city:"New York, NY",
    accountType:"broker", brokerLicense:"NMLS-1847392", brokerCompany:"Chase Home Lending",
    brokerPhone:"(212) 555-0198", brokerTier:"pro", photoPreview:null,
    bio:"Senior mortgage broker at Chase Home Lending with 12 years helping NYC buyers close faster and smarter. Specializing in conventional, FHA, and VA loans. NMLS #1847392.",
    updates:[
      {
        id:1,
        text:"Interest rates shifted again this week. If you're on the fence about buying — getting pre-approved now locks in today's rate for 90 days. Even if you're 2–3 months from being ready, it's worth doing. Happy to walk anyone through the process.",
        time:"2 days ago", likes:22,
        replies:[
          { id:101, av:"M", name:"Marcus T.", time:"2 days ago", text:"This is really helpful Robert. Does getting pre-approved through Chase mean I have to use Chase for the actual mortgage?" },
          { id:102, av:"R", name:"Robert Chen", time:"2 days ago", text:"Great question Marcus — not at all. The pre-approval is free and non-binding. You can shop around afterward and use whoever gives you the best rate. I'd always encourage comparing at least 2–3 lenders." },
          { id:103, av:"N", name:"Nate G.", time:"1 day ago", text:"Robert I've been following your updates and you clearly know your stuff. I'm a grad student moving to NYC — is FHA even a realistic option for me given my income situation?" },
          { id:104, av:"R", name:"Robert Chen", time:"1 day ago", text:"Absolutely Nate — FHA requires as little as 3.5% down and has more flexible income requirements than conventional. Send me a message and I can run your numbers privately. No commitment, just information. 🏦" },
        ]
      },
      {
        id:2,
        text:"One thing most buyers don't realize: your debt-to-income ratio matters more than your credit score when getting approved for a mortgage. You can have a 780 credit score and still get denied if your monthly debt payments are too high. Pay down credit cards before you apply — it makes a real difference.",
        time:"5 days ago", likes:38,
        replies:[
          { id:201, av:"A", name:"Aisha L.", time:"5 days ago", text:"Robert this is gold. I had no idea DTI was that important. What's the ideal ratio lenders want to see?" },
          { id:202, av:"R", name:"Robert Chen", time:"5 days ago", text:"Most lenders want your total monthly debt (including the new mortgage) to be under 43% of your gross monthly income. Under 36% is considered strong. I can calculate yours in 5 minutes if you want to message me." },
          { id:203, av:"J", name:"Jordan M.", time:"4 days ago", text:"This answers a question I've been embarrassed to ask my agent. Thank you for putting this out there publicly." },
        ]
      },
    ],
    linkedLeads:[
      { id:1, name:"Jordan Mitchell", av:"J", location:"Bronx, NY",           propertyType:"Buy",  timeline:"3–6 months",  preApproval:"In progress", hasAgent:true,  agentName:"Sandra Lee",  hasBroker:false, lastActive:"2h ago" },
      { id:2, name:"Tyrese Walker",   av:"T", location:"Brooklyn, NY",        propertyType:"Buy",  timeline:"1–3 months",  preApproval:"Not yet",     hasAgent:false, agentName:null,          hasBroker:false, lastActive:"4h ago" },
      { id:3, name:"Camille Torres",  av:"C", location:"Upper West Side, NY", propertyType:"Rent", timeline:"ASAP",        preApproval:"N/A",         hasAgent:false, agentName:null,          hasBroker:false, lastActive:"5h ago" },
      { id:4, name:"Nate G.",         av:"N", location:"Harlem, NY",          propertyType:"Buy",  timeline:"3–6 months",  preApproval:"Not yet",     hasAgent:false, agentName:null,          hasBroker:false, lastActive:"1h ago" },
      { id:5, name:"Devon R.",        av:"D", location:"Astoria, NY",         propertyType:"Buy",  timeline:"6–12 months", preApproval:"Not yet",     hasAgent:false, agentName:null,          hasBroker:false, lastActive:"3h ago" },
      { id:6, name:"Sofia R.",        av:"S", location:"Williamsburg, NY",    propertyType:"Rent", timeline:"ASAP",        preApproval:"N/A",         hasAgent:false, agentName:null,          hasBroker:false, lastActive:"30m ago" },
    ],
    stats:{ activeLeads:6, contactsMade:11, profileViews:98, noBrokerAlerts:4 },
  },
  buyer: {
    name:"Marcus T.", email:"marcus@email.com", av:"M", city:"New York, NY",
    accountType:"buyer", hasAgent:"yes", hasBroker:"yes",
    linkedAgent:{ name:"Sandra Lee", av:"S", license:"NY-1042873", brokerage:"Compass NYC" },
    linkedBroker:{ name:"Robert Chen", company:"Chase Home Lending", phone:"(212) 555-0198", license:"NMLS-1847392" },
  },
  management: {
    name:"David Park", email:"david@nycpm.com", av:"D", city:"New York, NY",
    accountType:"management", managementCompany:"Park Property Group",
    managementTier:"pro", photoPreview:null,
    bio:"Property manager with 15 years experience managing residential buildings across Manhattan and Brooklyn. We believe in transparent, responsive management. Our tenants deserve answers.",
    claimedListings:[
      { listingId:7,  address:"310 W 85th St, Apt 4C",    hood:"Upper West Side",   verified:true, verifiedDate:"3 months ago", totalComments:2, flaggedComments:0 },
      { listingId:8,  address:"57 Driggs Ave, Unit 2R",   hood:"Williamsburg",      verified:true, verifiedDate:"6 months ago", totalComments:2, flaggedComments:1 },
      { listingId:12, address:"415 Edgecombe Ave, 6D",    hood:"Washington Heights", verified:true, verifiedDate:"1 year ago",  totalComments:2, flaggedComments:0 },
    ],
    stats:{ claimedListings:3, totalResponses:11, avgResponseTime:"4 hrs", sentimentScore:72 },
  },
  landlord: {
    name:"James R.", email:"james@email.com", av:"J", city:"New York, NY",
    accountType:"landlord", photoPreview:null,
    bio:"Individual landlord — I own a 2-unit building in Washington Heights. I believe good landlords have nothing to hide. Happy to answer questions about my property.",
    claimedListings:[
      { listingId:12, address:"415 Edgecombe Ave, 6D", hood:"Washington Heights", verified:true, verifiedDate:"8 months ago", totalComments:2, flaggedComments:0 },
    ],
    stats:{ claimedListings:1, totalResponses:4, avgResponseTime:"2 hrs", sentimentScore:91 },
  },
};

// Mock community members for friend discovery
const MOCK_COMMUNITY = [
  { id:1, name:"Keisha T.", av:"K", city:"New York, NY", movingFrom:"Atlanta, GA", lookingFor:"1-2 bed rental", bio:"Teacher relocating to NYC for a new position. Love coffee shops and parks. Moving in June!", mutualListings:2, friendStatus:"none" },
  { id:2, name:"Devon R.", av:"D", city:"New York, NY", movingFrom:"Chicago, IL", lookingFor:"Studio or 1 bed", bio:"Remote software engineer. Big foodie. Looking for East Village or LES vibes.", mutualListings:1, friendStatus:"pending" },
  { id:3, name:"Lena K.", av:"L", city:"Denver, CO", movingFrom:"Denver, CO", lookingFor:"3 bed for sale", bio:"Local Denver resident upgrading from a condo. Love hiking and the outdoors.", mutualListings:1, friendStatus:"friends" },
  { id:4, name:"Nate G.", av:"N", city:"New York, NY", movingFrom:"Houston, TX", lookingFor:"1 bed rental UWS", bio:"Grad student at Columbia. First time in NYC. Terrified and excited in equal measure.", mutualListings:3, friendStatus:"none" },
  { id:5, name:"Sofia R.", av:"S", city:"New York, NY", movingFrom:"Miami, FL", lookingFor:"2 bed Brooklyn", bio:"Interior designer moving up from Miami. Obsessed with pre-war buildings and good light.", mutualListings:2, friendStatus:"none" },
];

// Update buyer demo with profile fields
Object.assign(DEMO_ACCOUNTS.buyer, {
  bio: "First-time buyer looking for my forever home in NYC. Originally from Newark, NJ. Love community, good food, and quiet streets.",
  lookingFor: "2–3 bed, For Sale, NYC",
  moveTimeline: "3–6 months",
  updates: [
    { id:1, text:"Just toured 3 places in Harlem this weekend — really impressed with the neighborhood energy!", time:"2 days ago", likes:4,
      replies:[
        { id:101, av:"K", name:"Keisha T.", time:"2 days ago", text:"Harlem is SO underrated right now. Which blocks did you check out? 125th area is completely transformed." },
        { id:102, av:"S", name:"Sofia R.", time:"1 day ago", text:"Agreed! I looked there too before settling on Brooklyn. The pre-war buildings on Convent Ave are stunning if you haven't seen them yet." },
        { id:103, av:"N", name:"Nate G.", time:"1 day ago", text:"Did you go through an agent or just walk-ins? I'm trying to figure out the best approach for my search." },
      ]
    },
    { id:2, text:"Anyone have experience with co-ops vs condos in NYC? Would love some insight from folks who've been through it.", time:"1 week ago", likes:7,
      replies:[
        { id:201, av:"L", name:"Lena K.", time:"1 week ago", text:"Co-ops are way stricter on the application process — board approval can take months and they dig into your financials hard. Condos are easier but pricier per sqft." },
        { id:202, av:"D", name:"Devon R.", time:"1 week ago", text:"Co-ops also have monthly maintenance fees that can be surprisingly high. Make sure you factor that into your budget. My friend got caught off guard by that." },
        { id:203, av:"S", name:"Sofia R.", time:"6 days ago", text:"One thing people miss — co-ops often don't allow subletting which matters if your plans change. Condos give you way more flexibility down the road." },
        { id:204, av:"K", name:"Keisha T.", time:"5 days ago", text:"Also check the underlying mortgage on the co-op building itself. Some older buildings carry a lot of debt which affects your monthly costs." },
      ]
    },
  ],
  friends: [3],
  pendingReceived: [2],
  pendingProRequests: [
    { id:"pro-1", type:"agent", name:"Sandra Lee", av:"S", license:"NY-1042873", brokerage:"Compass NYC", rating:4.9, reviews:87, time:"1h ago", message:"Hi Marcus — I've been following your activity on Chathouse and I'd love to be your agent. I specialize in first-time buyers in NYC and know Harlem and Washington Heights well. No pressure — happy to answer any questions first." },
    { id:"pro-2", type:"broker", name:"Robert Chen", av:"R", license:"NMLS-1847392", company:"Chase Home Lending", phone:"(212) 555-0198", time:"3h ago", message:"Hey Marcus, I noticed you're searching in NYC without a mortgage broker yet. I can get you pre-approved quickly and walk you through your options. Would love to be your broker on Chathouse." },
  ],
});

// ─── ATOMS ────────────────────────────────────────────────────────────────────
const ff = "'Outfit',sans-serif";
const serif = "'Playfair Display',serif";

function Av({ letter, size=36 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:AV_BG[letter]||"#64748b", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:size*0.38, flexShrink:0, fontFamily:ff }}>
      {letter}
    </div>
  );
}

function Badge({ source, type }) {
  const isRent = type==="rent";
  const s = isRent ? {bg:"#fff7ed",c:"#c2410c",b:"#fed7aa"} : {bg:"#f0fdf4",c:"#15803d",b:"#bbf7d0"};
  return <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:s.bg, color:s.c, border:`1px solid ${s.b}`, fontFamily:ff }}>{isRent?"🏢 Rental":"🏠 For Sale"}</span>;
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ border:`1.5px solid ${active?"#2563eb":"#e2e8f0"}`, background:active?"#eff6ff":"#fff", color:active?"#2563eb":"#64748b", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff, whiteSpace:"nowrap", transition:"all 0.15s" }}>
      {children}
    </button>
  );
}

function formatPrice(listing) {
  if (listing.type==="rent") return `$${listing.price.toLocaleString()}/mo`;
  return `$${listing.price.toLocaleString()}`;
}

// ─── MY PROFILE PAGE ──────────────────────────────────────────────────────────
function MyProfile({ user, onUpdateUser, isPro, pendingConnects=[] }) {
  const [editingBio, setEditingBio] = useState(false);
  const [editingLooking, setEditingLooking] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  const [lookingFor, setLookingFor] = useState(user.lookingFor || "");
  const [moveTimeline, setMoveTimeline] = useState(user.moveTimeline || "");
  const [newUpdate, setNewUpdate] = useState("");
  const [updates, setUpdates] = useState(user.updates || []);
  const [friends, setFriends] = useState(user.friends || []);
  const [pendingReceived, setPendingReceived] = useState(user.pendingReceived || []);
  const [pendingProRequests, setPendingProRequests] = useState(user.pendingProRequests || []);
  const [updateLikes, setUpdateLikes] = useState({});
  const [alerts, setAlerts] = useState([
    { id:1, label:"1BR Rentals in Harlem", city:"New York, NY", type:"For Rent", beds:"1", maxPrice:2800, active:true, matches:3, lastMatch:"2h ago" },
    { id:2, label:"2–3BR For Sale in Brooklyn", city:"New York, NY", type:"For Sale", beds:"2+", maxPrice:800000, active:true, matches:1, lastMatch:"Yesterday" },
  ]);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({ city:"New York, NY", type:"For Rent", beds:"Any", maxPrice:"" });
  const [activeTab, setActiveTab] = useState("profile");

  // Merge in any connects made from listing drawers
  const allPendingIds = [
    ...pendingReceived,
    ...pendingConnects.map(p => p.id).filter(id => !pendingReceived.includes(id) && !friends.includes(id))
  ];
  const allPendingProfiles = [
    ...MOCK_COMMUNITY.filter(m => allPendingIds.includes(m.id)),
    ...pendingConnects.filter(p => !MOCK_COMMUNITY.find(m => m.id===p.id) && !friends.includes(p.id))
  ];

  const save = () => { onUpdateUser({...user, bio, lookingFor, moveTimeline}); setEditingBio(false); setEditingLooking(false); };
  const postUpdate = () => {
    if (!newUpdate.trim()) return;
    setUpdates(p => [{ id:Date.now(), text:newUpdate.trim(), time:"Just now", likes:0 }, ...p]);
    setNewUpdate("");
  };
  const acceptFriend = id => { setFriends(p => [...p, id]); setPendingReceived(p => p.filter(x => x!==id)); };
  const declineFriend = id => setPendingReceived(p => p.filter(x => x!==id));

  const myFriends = MOCK_COMMUNITY.filter(m => friends.includes(m.id));
  const friendRequests = allPendingProfiles.filter(m => !friends.includes(m.id));
  const suggestions = MOCK_COMMUNITY.filter(m => !friends.includes(m.id) && !allPendingIds.includes(m.id));

  const SubTab = ({k,l}) => (
    <button onClick={() => setActiveTab(k)} style={{ border:"none", background:"transparent", padding:"8px 16px", fontSize:13, fontWeight:600, cursor:"pointer", color:activeTab===k?"#2563eb":"#64748b", borderBottom:activeTab===k?"2.5px solid #2563eb":"2.5px solid transparent", transition:"all 0.15s", fontFamily:ff, whiteSpace:"nowrap" }}>{l}</button>
  );

  return (
    <div style={{ animation:"fadeUp 0.3s ease", maxWidth:780, margin:"0 auto" }}>

      {/* Profile header */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:20 }}>
        <div style={{ height:72, background:"linear-gradient(135deg,#2563eb,#7c3aed)" }}/>
        <div style={{ padding:"0 24px 20px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:14, marginTop:-28, marginBottom:14 }}>
            <div style={{ border:"3px solid #fff", borderRadius:"50%", flexShrink:0 }}>
              {user.photoPreview ? <img src={user.photoPreview} alt="" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover" }}/> : <Av letter={user.av} size={56}/>}
            </div>
            <div style={{ flex:1, paddingBottom:4 }}>
              <div style={{ fontSize:18, fontWeight:800, color:"#1a202c", fontFamily:serif }}>{user.name}</div>
              <div style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>📍 {user.city}{moveTimeline ? ` · Moving in ${moveTimeline}` : ""}</div>
            </div>
            <div style={{ display:"flex", gap:20, paddingBottom:4 }}>
              {(isPro
                ? [{v:(user.linkedBuyers||user.linkedLeads||[]).length,l:"Clients"},{v:updates.length,l:"Updates"},{v:"4.9★",l:"Rating"}]
                : [{v:myFriends.length,l:"Friends"},{v:updates.length,l:"Updates"},{v:3,l:"Comments"}]
              ).map(({v,l}) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#1a202c", fontFamily:serif }}>{v}</div>
                  <div style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          {editingBio ? (
            <div style={{ marginBottom:12 }}>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell the community about yourself..."
                style={{ width:"100%", padding:"10px 12px", border:"1.5px solid #2563eb", borderRadius:10, fontSize:13, fontFamily:ff, resize:"none", outline:"none", color:"#334155", lineHeight:1.6 }}/>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button onClick={save} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:ff }}>Save</button>
                <button onClick={() => setEditingBio(false)} style={{ background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:12 }}>
              <p style={{ fontSize:13, color:"#475569", lineHeight:1.65, fontFamily:ff, flex:1 }}>{bio || "Add a bio to let the community know who you are..."}</p>
              <button onClick={() => setEditingBio(true)} style={{ border:"1px solid #e8eaed", background:"#fff", borderRadius:7, padding:"4px 10px", fontSize:11, color:"#64748b", cursor:"pointer", fontFamily:ff, flexShrink:0 }}>✏️ Edit</button>
            </div>
          )}

          {/* Pro: Accomplishments / Buyer: What I'm looking for */}
          {isPro ? (
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, display:"block", marginBottom:12 }}>
                {user.accountType==="agent" ? "Agent Highlights" : "Broker Highlights"}
              </span>
              {user.accountType==="agent" ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[
                    { icon:"🏙️", label:"Market", value:"All 5 Boroughs" },
                    { icon:"📅", label:"Experience", value:"8 Years" },
                    { icon:"🏠", label:"Deals Closed", value:"200+" },
                    { icon:"⭐", label:"Avg Rating", value:"4.9 / 5.0" },
                    { icon:"🏢", label:"Brokerage", value:"Compass NYC" },
                    { icon:"🎓", label:"Specialty", value:"First-Time Buyers" },
                  ].map(({icon,label,value}) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:15 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{label}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#334155", fontFamily:ff }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[
                    { icon:"🏦", label:"Lender", value:"Chase Home Lending" },
                    { icon:"📅", label:"Experience", value:"12 Years" },
                    { icon:"📋", label:"Loans Closed", value:"500+" },
                    { icon:"⭐", label:"Avg Rating", value:"4.8 / 5.0" },
                    { icon:"💰", label:"Loan Types", value:"Conv · FHA · VA" },
                    { icon:"⚡", label:"Avg Close Time", value:"21 Days" },
                  ].map(({icon,label,value}) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:15 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{label}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#334155", fontFamily:ff }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ background:"#f8fafc", borderRadius:10, padding:"12px 14px", border:"1px solid #f1f5f9" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:editingLooking?10:6 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff }}>My Real Estate Situation</span>
                {!editingLooking && <button onClick={() => setEditingLooking(true)} style={{ border:"1px solid #e8eaed", background:"#fff", borderRadius:7, padding:"3px 9px", fontSize:11, color:"#64748b", cursor:"pointer", fontFamily:ff }}>✏️ Edit</button>}
              </div>
              {editingLooking ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input value={lookingFor} onChange={e => setLookingFor(e.target.value)} placeholder="e.g. Looking for 2BR in NYC · Current resident of Harlem · Past tenant in Brooklyn" style={{ padding:"8px 12px", border:"1.5px solid #2563eb", borderRadius:8, fontSize:13, fontFamily:ff, outline:"none", color:"#334155" }}/>
                  <input value={moveTimeline} onChange={e => setMoveTimeline(e.target.value)} placeholder="Timeline e.g. 3–6 months" style={{ padding:"8px 12px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:ff, outline:"none", color:"#334155" }}/>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={save} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:ff }}>Save</button>
                    <button onClick={() => setEditingLooking(false)} style={{ background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                  {[{l:"Property",v:lookingFor||"Not set"},{l:"Timeline",v:moveTimeline||"Not set"}].map(({l,v}) => (
                    <div key={l}>
                      <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{l}: </span>
                      <span style={{ fontSize:13, fontWeight:600, color:"#334155", fontFamily:ff }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sub tabs */}
        <div style={{ borderTop:"1px solid #f1f5f9", padding:"0 24px", display:"flex", gap:2, overflowX:"auto" }}>
          <SubTab k="profile" l="📝 Updates"/>
          {isPro ? (
            <>
              <SubTab k="clients" l={`🔗 Client Links (${isPro && user.accountType==="agent" ? (user.linkedBuyers||DEMO_ACCOUNTS.agent.linkedBuyers).length : (user.linkedLeads||DEMO_ACCOUNTS.broker.linkedLeads).length})`}/>
              <SubTab k="reviews" l="⭐ Reviews"/>
              <SubTab k="achievements" l="🏆 Achievements"/>
            </>
          ) : (
            <>
              <SubTab k="friends" l={`👥 Friends${myFriends.length?` (${myFriends.length})`:""}`}/>
              <SubTab k="requests" l={`🔔 Requests${(friendRequests.length + pendingProRequests.length) ? ` (${friendRequests.length + pendingProRequests.length})` : ""}`}/>
              <SubTab k="discover" l="🌎 Discover"/>
              <SubTab k="alerts" l={`🔔 My Alerts${alerts.length ? ` (${alerts.length})` : ""}`}/>
            </>
          )}
        </div>
      </div>

      {/* UPDATES TAB */}
      {activeTab==="profile" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"16px 18px" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              {user.photoPreview ? <img src={user.photoPreview} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/> : <Av letter={user.av} size={36}/>}
              <div style={{ flex:1, background:"#f8fafc", borderRadius:12, border:"1.5px solid #e8eaed", padding:"10px 14px" }}>
                <textarea value={newUpdate} onChange={e => setNewUpdate(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();postUpdate();} }}
                  placeholder={isPro ? "Share a market update, tip, or insight with the community..." : "Share an update — a tour, a neighborhood find, or local insight..."}
                  rows={2} style={{ width:"100%", border:"none", background:"transparent", resize:"none", outline:"none", fontSize:13, color:"#1a202c", lineHeight:1.55, fontFamily:ff }}/>
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
                  <button onClick={postUpdate} disabled={!newUpdate.trim()} style={{ background:newUpdate.trim()?"#2563eb":"#e2e8f0", color:newUpdate.trim()?"#fff":"#94a3b8", border:"none", borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700, cursor:newUpdate.trim()?"pointer":"default", fontFamily:ff, transition:"all 0.15s" }}>Post</button>
                </div>
              </div>
            </div>
          </div>
          {updates.map(u => (
            <div key={u.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", overflow:"hidden" }}>
              {/* Main post */}
              <div style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  {user.photoPreview ? <img src={user.photoPreview} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/> : <Av letter={user.av} size={36}/>}
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{user.name}</span>
                      {isPro && (
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
                          background: user.accountType==="agent" ? "#f0fdf4" : "#f5f3ff",
                          color: user.accountType==="agent" ? "#15803d" : "#6d28d9",
                          fontFamily:ff }}>
                          {user.accountType==="agent" ? "🤝 Agent" : "🏦 Broker"}
                        </span>
                      )}
                      <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{u.time}</span>
                    </div>
                    <p style={{ fontSize:14, color:"#334155", lineHeight:1.6, fontFamily:ff, marginBottom:10 }}>{u.text}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <button onClick={() => setUpdateLikes(p => ({...p,[u.id]:!p[u.id]}))} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:updateLikes[u.id]?"#2563eb":"#94a3b8", fontWeight:600, fontFamily:ff }}>
                        {updateLikes[u.id]?"♥":"♡"} {u.likes+(updateLikes[u.id]?1:0)}
                      </button>
                      {u.replies?.length > 0 && <span style={{ fontSize:12, color:"#94a3b8", fontFamily:ff }}>💬 {u.replies.length} replies</span>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Replies */}
              {u.replies?.length > 0 && (
                <div style={{ borderTop:"1px solid #f1f5f9", background:"#f8fafc" }}>
                  {u.replies.map((r, i) => {
                    const isProReply = r.av === user.av && isPro;
                    return (
                      <div key={r.id} style={{ display:"flex", gap:10, padding:"12px 18px", borderBottom: i < u.replies.length-1 ? "1px solid #f1f5f9" : "none", background: isProReply ? (user.accountType==="agent"?"#f0fdf4":"#f5f3ff") : "transparent" }}>
                        <Av letter={r.av} size={28}/>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                            <span style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{r.name}</span>
                            {isProReply && (
                              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
                                background: user.accountType==="agent" ? "#16a34a" : "#7c3aed",
                                color:"#fff", fontFamily:ff }}>
                                {user.accountType==="agent" ? "🤝 Agent" : "🏦 Broker"}
                              </span>
                            )}
                            <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{r.time}</span>
                          </div>
                          <p style={{ fontSize:13, color:"#475569", lineHeight:1.55, fontFamily:ff }}>{r.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* Reply input */}
                  <div style={{ padding:"10px 18px", display:"flex", gap:10, alignItems:"center", borderTop:"1px solid #f1f5f9" }}>
                    {user.photoPreview ? <img src={user.photoPreview} alt="" style={{ width:26, height:26, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/> : <Av letter={user.av} size={26}/>}
                    <input placeholder="Write a reply..." style={{ flex:1, padding:"7px 12px", border:"1.5px solid #e8eaed", borderRadius:20, fontSize:12, fontFamily:ff, outline:"none", color:"#334155", background:"#fff" }}/>
                  </div>
                </div>
              )}
            </div>
          ))}
          {updates.length===0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8", fontSize:14, fontFamily:ff }}>No updates yet — share what you're up to!</div>}
        </div>
      )}

      {/* PRO: CLIENT LINKS TAB */}
      {activeTab==="clients" && isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", padding:"32px 24px", textAlign:"center" }}>
            <div style={{ fontSize:64, fontWeight:800, color:"#16a34a", fontFamily:serif, lineHeight:1 }}>
              {user.accountType==="agent" ? (user.linkedBuyers||DEMO_ACCOUNTS.agent.linkedBuyers).length : (user.linkedLeads||DEMO_ACCOUNTS.broker.linkedLeads).length}
            </div>
            <div style={{ fontSize:16, fontWeight:600, color:"#334155", fontFamily:ff, marginTop:8 }}>Active Client Links</div>
            <div style={{ fontSize:13, color:"#94a3b8", fontFamily:ff, marginTop:6, maxWidth:320, margin:"8px auto 0" }}>
              Buyers who have linked this {user.accountType==="agent" ? "agent" : "broker"} to their Chathouse profile
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:24 }}>
              {[{v:"4.9★", l:"Avg rating"},{v:"87", l:"Reviews"},{v:"142", l:"Profile views"}].map(({v,l}) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:"#1a202c", fontFamily:serif }}>{v}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1.5px solid #bbf7d0", borderRadius:12, padding:"12px 16px" }}>
            <p style={{ fontSize:13, color:"#14532d", fontFamily:ff }}>🔒 Client details are private. Only the {user.accountType==="agent" ? "agent" : "broker"} can view who their linked clients are via their dashboard.</p>
          </div>
        </div>
      )}

      {/* PRO: REVIEWS TAB */}
      {activeTab==="reviews" && isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"16px 20px", display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:42, fontWeight:800, color:"#1a202c", fontFamily:serif, lineHeight:1 }}>4.9</div>
              <div style={{ fontSize:18, color:"#f59e0b", marginTop:2 }}>★★★★★</div>
              <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>87 reviews</div>
            </div>
            <div style={{ flex:1 }}>
              {[{stars:5,count:74},{stars:4,count:10},{stars:3,count:2},{stars:2,count:1},{stars:1,count:0}].map(({stars,count}) => (
                <div key={stars} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, color:"#64748b", fontFamily:ff, width:14 }}>{stars}</span>
                  <span style={{ fontSize:11, color:"#f59e0b" }}>★</span>
                  <div style={{ flex:1, height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(count/87)*100}%`, background:"#f59e0b", borderRadius:3 }}/>
                  </div>
                  <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, width:20 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          {[
            { id:1, av:"J", name:"Jordan Mitchell", rating:5, time:"2 weeks ago", text:"Sandra was incredible throughout the whole process. She knew every building in Harlem and always had honest opinions. Never felt pressured once." },
            { id:2, av:"A", name:"Aisha Lewis", rating:5, time:"1 month ago", text:"Best agent I've worked with. She found us our dream apartment in Queens within 3 weeks. Her neighborhood knowledge is unmatched." },
            { id:3, av:"C", name:"Camille Torres", rating:4, time:"2 months ago", text:"Really responsive and patient with all my questions as a first-time renter. Would have given 5 stars but the process took a bit longer than expected." },
            { id:4, av:"N", name:"Nate G.", rating:5, time:"3 months ago", text:"Sandra helped me navigate the NYC rental market as a complete outsider. I had zero idea what I was doing and she walked me through everything step by step." },
          ].map(r => (
            <div key={r.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <Av letter={r.av} size={36}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{r.name}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{r.time}</div>
                </div>
                <div style={{ fontSize:14, color:"#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
              </div>
              <p style={{ fontSize:13, color:"#475569", lineHeight:1.65, fontFamily:ff }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* PRO: ACHIEVEMENTS TAB */}
      {activeTab==="achievements" && isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"linear-gradient(135deg,#fffbeb,#fef3c7)", border:"1.5px solid #fde68a", borderRadius:12, padding:"12px 16px" }}>
            <p style={{ fontSize:13, color:"#92400e", fontFamily:ff }}>🏆 <strong>Achievements</strong> — earned by hitting milestones on Chathouse. Displayed publicly on your profile so clients can see your track record.</p>
          </div>
          {[
            { earned:true,  icon:"🏆", title:"First Link", desc:"Got your first client link", color:"#f59e0b", bg:"#fffbeb", border:"#fde68a" },
            { earned:true,  icon:"🥇", title:"5 Client Links", desc:"5 buyers linked your profile", color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
            { earned:true,  icon:"💬", title:"Community Voice", desc:"Received 50+ comment likes", color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
            { earned:true,  icon:"⭐", title:"Top Rated", desc:"Achieved a 4.5+ star rating", color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
            { earned:false, icon:"🔟", title:"10 Client Links", desc:"10 buyers linked your profile", color:"#64748b", bg:"#f8fafc", border:"#e2e8f0", progress:3, goal:10 },
            { earned:false, icon:"🌟", title:"25 Client Links", desc:"25 buyers linked your profile", color:"#64748b", bg:"#f8fafc", border:"#e2e8f0", progress:3, goal:25 },
            { earned:false, icon:"💯", title:"100 Client Links", desc:"Chathouse Legend — 100 buyer links", color:"#64748b", bg:"#f8fafc", border:"#e2e8f0", progress:3, goal:100, legendary:true },
            { earned:false, icon:"📝", title:"10 Reviews", desc:"Received 10 client reviews", color:"#64748b", bg:"#f8fafc", border:"#e2e8f0", progress:4, goal:10 },
          ].map((a,i) => (
            <div key={i} style={{ background:a.bg, borderRadius:14, border:`1.5px solid ${a.border}`, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, opacity: a.earned ? 1 : 0.7 }}>
              <div style={{ width:52, height:52, borderRadius:14, background: a.earned ? a.bg : "#f1f5f9", border:`2px solid ${a.earned ? a.border : "#e2e8f0"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, filter: a.earned ? "none" : "grayscale(1)" }}>
                {a.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:700, color: a.earned ? "#1a202c" : "#94a3b8", fontFamily:ff }}>{a.title}</span>
                  {a.legendary && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#fef3c7", color:"#d97706", fontFamily:ff }}>LEGENDARY</span>}
                  {a.earned && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background: a.bg, color: a.color, fontFamily:ff }}>✓ Earned</span>}
                </div>
                <div style={{ fontSize:12, color: a.earned ? "#64748b" : "#94a3b8", fontFamily:ff, marginBottom: !a.earned && a.progress ? 8 : 0 }}>{a.desc}</div>
                {!a.earned && a.progress && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>Progress</span>
                      <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{a.progress}/{a.goal}</span>
                    </div>
                    <div style={{ height:5, background:"#e2e8f0", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(a.progress/a.goal)*100}%`, background:"#2563eb", borderRadius:3, transition:"width 0.3s" }}/>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BUYER: FRIENDS TAB */}
      {activeTab==="friends" && !isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {myFriends.length===0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8", fontSize:14, fontFamily:ff }}>No friends yet — check Discover to connect with people!</div>}
          {myFriends.map(f => (
            <div key={f.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <Av letter={f.av} size={44}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff, marginBottom:2 }}>{f.name}</div>
                <div style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>📍 {f.city}{f.movingFrom!==f.city?` · Moving from ${f.movingFrom}`:""}</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:3, lineHeight:1.5, fontFamily:ff }}>🏠 {f.lookingFor}</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:3, lineHeight:1.5, fontFamily:ff }}>{f.bio}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                <button style={{ background:"#eff6ff", color:"#2563eb", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>💬 Message</button>
                <button onClick={() => setFriends(p => p.filter(x => x!==f.id))} style={{ background:"#fff", color:"#94a3b8", border:"1px solid #e8eaed", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Unfriend</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BUYER: REQUESTS TAB */}
      {activeTab==="requests" && !isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Professional link requests */}
          {pendingProRequests.length > 0 && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff }}>Professional Requests</span>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#fef3c7", color:"#d97706", fontFamily:ff }}>New</span>
              </div>
              {pendingProRequests.map(req => (
                <div key={req.id} style={{ background:"#fff", borderRadius:14, border:`1.5px solid ${req.type==="agent"?"#bbf7d0":"#ddd6fe"}`, padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                    <div style={{ position:"relative", flexShrink:0 }}>
                      <Av letter={req.av} size={44}/>
                      <span style={{ position:"absolute", bottom:-2, right:-2, fontSize:12, background:"#fff", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #e8eaed" }}>
                        {req.type==="agent"?"🤝":"🏦"}
                      </span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                        <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{req.name}</span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
                          background: req.type==="agent"?"#f0fdf4":"#f5f3ff",
                          color: req.type==="agent"?"#15803d":"#6d28d9", fontFamily:ff }}>
                          {req.type==="agent"?"🤝 Agent":"🏦 Broker"}
                        </span>
                        <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{req.time}</span>
                      </div>
                      <div style={{ fontSize:12, color:"#64748b", fontFamily:ff, marginBottom:6 }}>
                        {req.type==="agent"
                          ? `${req.brokerage} · License ${req.license} · ⭐ ${req.rating} (${req.reviews} reviews)`
                          : `${req.company} · NMLS ${req.license} · ${req.phone}`
                        }
                      </div>
                      <div style={{ background:"#f8fafc", borderRadius:10, padding:"10px 12px", fontSize:13, color:"#475569", lineHeight:1.6, fontFamily:ff, borderLeft:`3px solid ${req.type==="agent"?"#16a34a":"#7c3aed"}` }}>
                        "{req.message}"
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => {
                      setPendingProRequests(p => p.filter(r => r.id !== req.id));
                      onUpdateUser({...user,
                        hasAgent: req.type==="agent" ? "yes" : user.hasAgent,
                        hasBroker: req.type==="broker" ? "yes" : user.hasBroker,
                        linkedAgent: req.type==="agent" ? { name:req.name, av:req.av, license:req.license, brokerage:req.brokerage } : user.linkedAgent,
                        linkedBroker: req.type==="broker" ? { name:req.name, company:req.company, phone:req.phone, license:req.license } : user.linkedBroker,
                      });
                    }} style={{ flex:2, background: req.type==="agent"?"#16a34a":"#7c3aed", color:"#fff", border:"none", borderRadius:10, padding:"9px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:ff }}>
                      ✓ Accept {req.type==="agent"?"Agent":"Broker"}
                    </button>
                    <button onClick={() => setPendingProRequests(p => p.filter(r => r.id !== req.id))} style={{ flex:1, background:"#fff", color:"#94a3b8", border:"1.5px solid #e8eaed", borderRadius:10, padding:"9px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              {friendRequests.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff }}>Friend Requests</span>
                </div>
              )}
            </>
          )}

          {/* Friend requests */}
          {friendRequests.length===0 && pendingProRequests.length===0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8", fontSize:14, fontFamily:ff }}>No pending requests.</div>}
          {friendRequests.map(f => (
            <div key={f.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:12 }}>
              <Av letter={f.av} size={44}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff, marginBottom:2 }}>{f.name}</div>
                <div style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>📍 {f.city} · Moving from {f.movingFrom}</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:3, lineHeight:1.5, fontFamily:ff }}>🏠 {f.lookingFor}</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:3, lineHeight:1.5, fontFamily:ff }}>{f.bio}</div>
                {f.mutualListings>0 && <div style={{ fontSize:11, color:"#7c3aed", fontFamily:ff, marginTop:6, fontWeight:600 }}>💬 You both commented on {f.mutualListings} listing{f.mutualListings>1?"s":""}</div>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                <button onClick={() => acceptFriend(f.id)} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:ff }}>✓ Accept</button>
                <button onClick={() => declineFriend(f.id)} style={{ background:"#fff", color:"#94a3b8", border:"1px solid #e8eaed", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BUYER: DISCOVER TAB */}
      {activeTab==="discover" && !isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:"linear-gradient(135deg,#eff6ff,#f5f3ff)", border:"1.5px solid #bfdbfe", borderRadius:12, padding:"12px 16px", marginBottom:4 }}>
            <p style={{ fontSize:13, color:"#1e40af", fontFamily:ff }}>🌎 <strong>People you might know</strong> — based on listings you've both commented on or neighborhoods you're both exploring.</p>
          </div>
          {suggestions.map(f => (
            <div key={f.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:12 }}>
              <Av letter={f.av} size={44}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff, marginBottom:2 }}>{f.name}</div>
                <div style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>📍 {f.city}{f.movingFrom!==f.city?` · Moving from ${f.movingFrom}`:""}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2, fontFamily:ff }}>🏠 Looking for: {f.lookingFor}</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:5, lineHeight:1.55, fontFamily:ff }}>{f.bio}</div>
                {f.mutualListings>0 && <div style={{ fontSize:11, color:"#7c3aed", fontWeight:600, marginTop:6, fontFamily:ff }}>💬 You both commented on {f.mutualListings} listing{f.mutualListings>1?"s":""}</div>}
              </div>
              <button onClick={() => setPendingReceived(p => [...p, f.id])} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:ff, flexShrink:0 }}>
                + Connect
              </button>
            </div>
          ))}
          {suggestions.length===0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8", fontSize:14, fontFamily:ff }}>You've connected with everyone nearby — check back soon!</div>}
        </div>
      )}

      {/* BUYER: ALERTS TAB */}
      {activeTab==="alerts" && !isPro && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Intro banner */}
          <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", borderRadius:12, padding:"12px 16px" }}>
            <p style={{ fontSize:13, color:"#1e40af", fontFamily:ff }}>🔔 <strong>Listing Alerts</strong> — get notified the moment a listing matching your criteria hits the market. Never miss a listing again.</p>
          </div>

          {/* Existing alerts */}
          {alerts.map(alert => (
            <div key={alert.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background: alert.active?"#eff6ff":"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  🔔
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{alert.label}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
                      background: alert.active?"#f0fdf4":"#f1f5f9",
                      color: alert.active?"#15803d":"#94a3b8", fontFamily:ff }}>
                      {alert.active ? "● Active" : "Paused"}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:8 }}>
                    {[
                      {l:"City", v:alert.city},
                      {l:"Type", v:alert.type},
                      {l:"Beds", v:alert.beds},
                      {l:"Max Price", v:alert.type==="For Rent" ? `$${Number(alert.maxPrice).toLocaleString()}/mo` : `$${Number(alert.maxPrice).toLocaleString()}`},
                    ].map(({l,v}) => (
                      <span key={l} style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>
                        <span style={{ color:"#94a3b8" }}>{l}:</span> {v}
                      </span>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:11, color:"#2563eb", fontWeight:600, fontFamily:ff }}>
                      🏠 {alert.matches} matching listing{alert.matches!==1?"s":""} · Last match {alert.lastMatch}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                  <button onClick={() => setAlerts(p => p.map(a => a.id===alert.id ? {...a, active:!a.active} : a))}
                    style={{ fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, border:"1.5px solid #e2e8f0", background: alert.active?"#fff":"#f0fdf4", color: alert.active?"#64748b":"#15803d", cursor:"pointer", fontFamily:ff }}>
                    {alert.active ? "Pause" : "Resume"}
                  </button>
                  <button onClick={() => setAlerts(p => p.filter(a => a.id!==alert.id))}
                    style={{ fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, border:"1.5px solid #fecaca", background:"#fff", color:"#dc2626", cursor:"pointer", fontFamily:ff }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create new alert */}
          {!showNewAlert ? (
            <button onClick={() => setShowNewAlert(true)} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:ff, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              + Create New Alert
            </button>
          ) : (
            <div style={{ background:"#fff", borderRadius:14, border:"1.5px solid #2563eb", padding:"18px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff, marginBottom:14 }}>🔔 New Listing Alert</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

                {/* City */}
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>City</label>
                  <select value={newAlert.city} onChange={e=>setNewAlert(p=>({...p,city:e.target.value}))}
                    style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, fontFamily:ff, outline:"none", color:"#1a202c" }}>
                    {["New York, NY","Brooklyn, NY","Austin, TX","Atlanta, GA","Houston, TX","Denver, CO","Tampa, FL","Charlotte, NC"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Listing Type</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {["For Rent","For Sale"].map(t => (
                      <button key={t} onClick={()=>setNewAlert(p=>({...p,type:t}))}
                        style={{ flex:1, border:`1.5px solid ${newAlert.type===t?"#2563eb":"#e2e8f0"}`, background:newAlert.type===t?"#eff6ff":"#fff", color:newAlert.type===t?"#2563eb":"#64748b", borderRadius:10, padding:"9px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beds */}
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Bedrooms</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {["Any","Studio","1","2","3","4+"].map(b => (
                      <button key={b} onClick={()=>setNewAlert(p=>({...p,beds:b}))}
                        style={{ border:`1.5px solid ${newAlert.beds===b?"#2563eb":"#e2e8f0"}`, background:newAlert.beds===b?"#eff6ff":"#fff", color:newAlert.beds===b?"#2563eb":"#64748b", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>
                    Max Price {newAlert.type==="For Rent" ? "(per month)" : ""}
                  </label>
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#64748b", fontFamily:ff }}>$</span>
                    <input type="number" value={newAlert.maxPrice} onChange={e=>setNewAlert(p=>({...p,maxPrice:e.target.value}))}
                      placeholder={newAlert.type==="For Rent"?"3,000":"750,000"}
                      style={{ width:"100%", padding:"9px 12px 9px 26px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, fontFamily:ff, outline:"none", color:"#1a202c" }}/>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:8, marginTop:4 }}>
                  <button onClick={() => setShowNewAlert(false)} style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Cancel</button>
                  <button onClick={() => {
                    if (!newAlert.maxPrice) return;
                    const label = `${newAlert.beds==="Any"?"Any bed":newAlert.beds==="Studio"?"Studio":`${newAlert.beds}BR`} ${newAlert.type} in ${newAlert.city.split(",")[0]}`;
                    setAlerts(p => [...p, { id:Date.now(), label, ...newAlert, active:true, matches:0, lastMatch:"Just created" }]);
                    setNewAlert({ city:"New York, NY", type:"For Rent", beds:"Any", maxPrice:"" });
                    setShowNewAlert(false);
                  }} disabled={!newAlert.maxPrice} style={{ flex:2, background:newAlert.maxPrice?"#2563eb":"#e2e8f0", color:newAlert.maxPrice?"#fff":"#94a3b8", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:700, cursor:newAlert.maxPrice?"pointer":"default", fontFamily:ff, transition:"all 0.2s" }}>
                    🔔 Save Alert
                  </button>
                </div>
              </div>
            </div>
          )}

          {alerts.length===0 && !showNewAlert && (
            <div style={{ textAlign:"center", padding:"20px", color:"#94a3b8", fontSize:13, fontFamily:ff }}>No alerts yet — create one above to get notified when new listings match your search.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LINK REQUEST BUTTON ──────────────────────────────────────────────────────
function LinkRequestButton({ accountType, buyerName }) {
  const [sent, setSent] = useState(false);
  const isAgent = accountType==="agent";
  const color = isAgent ? "#16a34a" : "#7c3aed";
  const bg    = isAgent ? "#f0fdf4" : "#f5f3ff";
  const label = isAgent ? "🤝 Send Agent Request" : "🏦 Send Broker Request";
  const sentLabel = isAgent ? "✓ Agent Request Sent" : "✓ Broker Request Sent";

  return (
    <button
      onClick={() => setSent(true)}
      disabled={sent}
      style={{ background: sent ? "#f1f5f9" : color, color: sent ? "#94a3b8" : "#fff", border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor: sent ? "default" : "pointer", fontFamily:ff, transition:"all 0.2s" }}>
      {sent ? sentLabel : label}
    </button>
  );
}

// ─── BROKER LEAD FEED (visible only to agents + brokers) ──────────────────────
function BrokerLeadFeed({ user }) {
  const [filter, setFilter] = useState("all");
  const isPro = user.accountType === "broker" || user.accountType === "agent";
  if (!isPro) return null;

  const filtered = MOCK_BUYER_PROFILES.filter(p => {
    if (filter === "no_broker") return !p.hasBroker;
    if (filter === "has_broker") return p.hasBroker;
    return true;
  });

  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:24 }}>
      <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>
          {user.accountType === "broker" ? "🏦 Buyer Lead Feed" : "🔍 Buyer Leads"}
        </span>
        <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>— visible to verified professionals only</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {[{v:"all",l:"All"},{v:"no_broker",l:"No Broker"},{v:"has_broker",l:"Has Broker"}].map(({v,l}) => (
            <button key={v} onClick={() => setFilter(v)} style={{ border:`1.5px solid ${filter===v?"#7c3aed":"#e2e8f0"}`, background:filter===v?"#f5f3ff":"#fff", color:filter===v?"#7c3aed":"#64748b", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(buyer => (
          <div key={buyer.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px", background:"#f8fafc", borderRadius:12, border:"1px solid #f1f5f9" }}>
            <Av letter={buyer.av} size={38}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{buyer.name}</span>
                <span style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>📍 {buyer.location}</span>
                <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
                  background:buyer.hasBroker?"#f0fdf4":"#fffbeb",
                  color:buyer.hasBroker?"#15803d":"#d97706",
                  border:`1px solid ${buyer.hasBroker?"#bbf7d0":"#fde68a"}`,
                  fontFamily:ff }}>
                  {buyer.hasBroker ? "✓ Has broker" : "⚡ No broker"}
                </span>
              </div>
              <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:buyer.hasBroker?10:0 }}>
                {[{l:"Type",v:buyer.propertyType},{l:"Timeline",v:buyer.timeline},{l:"Pre-approval",v:buyer.preApproval}].map(({l,v}) => (
                  <div key={l}>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{l}: </span>
                    <span style={{ fontSize:12, fontWeight:600, color:"#334155", fontFamily:ff }}>{v}</span>
                  </div>
                ))}
                {buyer.hasAgent && (
                  <div>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>Agent: </span>
                    <span style={{ fontSize:12, fontWeight:600, color:"#2563eb", fontFamily:ff }}>{buyer.agentName}</span>
                  </div>
                )}
              </div>
              {buyer.hasBroker ? (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:8, padding:"8px 12px", background:"#fff", borderRadius:8, border:"1px solid #e8eaed" }}>
                  <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>Mortgage broker:</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{buyer.brokerName}</span>
                  <span style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>{buyer.brokerCompany}</span>
                  <span style={{ marginLeft:"auto", fontSize:12, color:"#2563eb", fontWeight:600, cursor:"pointer", fontFamily:ff }}>{buyer.brokerPhone} ↗</span>
                </div>
              ) : (
                <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                  <LinkRequestButton accountType={user.accountType} buyerName={buyer.name}/>
                  <button style={{ background:"#f5f3ff", color:"#7c3aed", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                    💬 Message
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEWS FEED ────────────────────────────────────────────────────────────────
const MOCK_NEWS = [
  { id:1, category:"Market Trends", tag:"🔥 Hot", tagColor:"#dc2626", title:"NYC Rental Market Sees First Price Drop in 18 Months", summary:"Average asking rents in Manhattan dipped 2.3% in April, offering a rare window for renters who have been priced out since 2022. Analysts say the shift is driven by record new inventory hitting the market.", source:"Bloomberg Real Estate", time:"2 hours ago", img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", readTime:"3 min read" },
  { id:2, category:"Interest Rates", tag:"📊 Economy", tagColor:"#2563eb", title:"Fed Holds Rates Steady — Mortgage Rates Expected to Ease by Q3", summary:"The Federal Reserve held its benchmark rate at 5.25% this week, signaling possible cuts later this year. Mortgage economists expect 30-year fixed rates to fall below 6.5% by September.", source:"Wall Street Journal", time:"5 hours ago", img:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80", readTime:"4 min read" },
  { id:3, category:"First-Time Buyers", tag:"💡 Tips", tagColor:"#16a34a", title:"New FHA Rule Lowers Down Payment Requirements for Multi-Family Homes", summary:"A rule change effective this month allows FHA borrowers to purchase 2–4 unit properties with just 3.5% down, opening a path for buyers to generate rental income while building equity.", source:"HousingWire", time:"Yesterday", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80", readTime:"2 min read" },
  { id:4, category:"Neighborhoods", tag:"📍 Local", tagColor:"#7c3aed", title:"Harlem Named One of America's Top 10 Emerging Real Estate Markets", summary:"A new report ranks Harlem among the hottest neighborhoods for buyers in 2025, citing rising median incomes, improving transit, and strong community investment as key drivers.", source:"Redfin Research", time:"Yesterday", img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", readTime:"3 min read" },
  { id:5, category:"Investing", tag:"💼 Investor", tagColor:"#f59e0b", title:"Short-Term Rental Regulations Tighten in NYC — What Owners Need to Know", summary:"New Local Law 18 enforcement is now in full effect, requiring all short-term rental hosts to register with the city. Non-compliance fines start at $1,000 per violation.", source:"Curbed NY", time:"2 days ago", img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", readTime:"5 min read" },
  { id:6, category:"Policy", tag:"🏛️ Policy", tagColor:"#475569", title:"Congress Advances First-Time Homebuyer Tax Credit Bill", summary:"A bipartisan bill offering up to $10,000 in refundable tax credits for first-time homebuyers passed committee this week and is headed to a full Senate vote.", source:"Reuters", time:"3 days ago", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", readTime:"3 min read" },
];

function NewsFeed() {
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [articles, setArticles] = useState(MOCK_NEWS);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Market Trends", "Interest Rates", "First-Time Buyers", "Neighborhoods", "Investing", "Policy"];

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:[{ role:"user", content:"Search for the 3 most recent real estate news headlines from today. For each return: title, one sentence summary, source name, and category (Market Trends / Interest Rates / First-Time Buyers / Neighborhoods / Investing / Policy). Return as JSON array only, no markdown." }]
        })
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type==="text").map(b => b.text).join("") || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const live = parsed.map((a,i) => ({
          id: Date.now()+i, category:a.category||"Market Trends",
          tag:"🔴 Live", tagColor:"#dc2626",
          title:a.title, summary:a.summary,
          source:a.source||"Live News", time:"Just now",
          img: MOCK_NEWS[i % MOCK_NEWS.length].img,
          readTime:"2 min read", isLive:true
        }));
        setArticles([...live, ...MOCK_NEWS]);
        setRefreshed(true);
      }
    } catch { setRefreshed(true); }
    setLoading(false);
  };

  const filtered = activeCategory==="All" ? articles : articles.filter(a => a.category===activeCategory);

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:12 }}>
        <div>
          <span style={{ fontSize:22, fontWeight:800, color:"#1a202c", fontFamily:serif }}>📰 Real Estate News</span>
          <span style={{ fontSize:13, color:"#94a3b8", marginLeft:10, fontFamily:ff }}>Stay informed on what's moving the market</span>
        </div>
        <button onClick={handleRefresh} disabled={loading} style={{ display:"flex", alignItems:"center", gap:8, background: refreshed?"#f0fdf4":"#2563eb", color: refreshed?"#16a34a":"#fff", border: refreshed?"1.5px solid #bbf7d0":"none", borderRadius:10, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:loading?"default":"pointer", fontFamily:ff, transition:"all 0.2s" }}>
          {loading ? <><div style={{ width:14, height:14, border:"2px solid #fff", borderTop:"2px solid transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Fetching live news...</> : refreshed ? "✓ Live news loaded" : "🔄 Refresh for live news"}
        </button>
      </div>

      {/* Category filters */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{ border:`1.5px solid ${activeCategory===c?"#2563eb":"#e2e8f0"}`, background:activeCategory===c?"#eff6ff":"#fff", color:activeCategory===c?"#2563eb":"#64748b", padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff, transition:"all 0.15s" }}>{c}</button>
        ))}
      </div>

      {/* Featured article */}
      {filtered.length > 0 && (
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:20, cursor:"pointer" }}>
          <div style={{ position:"relative", height:220, overflow:"hidden" }}>
            <img src={filtered[0].img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(transparent 20%, rgba(0,0,0,0.75))" }}/>
            <div style={{ position:"absolute", top:14, left:14 }}>
              <span style={{ background:filtered[0].tagColor, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, fontFamily:ff }}>
                {filtered[0].tag} · {filtered[0].category}
              </span>
              {filtered[0].isLive && <span style={{ marginLeft:6, background:"#dc2626", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, fontFamily:ff, animation:"blink 2s infinite" }}>● LIVE</span>}
            </div>
            <div style={{ position:"absolute", bottom:16, left:18, right:18 }}>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", fontFamily:serif, lineHeight:1.3, marginBottom:6 }}>{filtered[0].title}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontFamily:ff }}>{filtered[0].source} · {filtered[0].time} · {filtered[0].readTime}</div>
            </div>
          </div>
          <div style={{ padding:"14px 18px" }}>
            <p style={{ fontSize:14, color:"#475569", lineHeight:1.65, fontFamily:ff }}>{filtered[0].summary}</p>
          </div>
        </div>
      )}

      {/* Article grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {filtered.slice(1).map(a => (
          <div key={a.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", overflow:"hidden", cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ position:"relative", height:140, overflow:"hidden" }}>
              <img src={a.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:6 }}>
                <span style={{ background:a.tagColor, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, fontFamily:ff }}>{a.tag}</span>
                {a.isLive && <span style={{ background:"#dc2626", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, fontFamily:ff, animation:"blink 2s infinite" }}>● LIVE</span>}
              </div>
            </div>
            <div style={{ padding:"12px 14px" }}>
              <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginBottom:5 }}>{a.category}</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff, lineHeight:1.4, marginBottom:6 }}>{a.title}</div>
              <p style={{ fontSize:12, color:"#64748b", lineHeight:1.55, fontFamily:ff, marginBottom:8 }}>{a.summary}</p>
              <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{a.source} · {a.time} · {a.readTime}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAYMENT CALCULATOR ───────────────────────────────────────────────────────
function PaymentCalculator() {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.8);
  const [term, setTerm] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [taxes, setTaxes] = useState(400);
  const [insurance, setInsurance] = useState(150);
  const [hoa, setHoa] = useState(0);
  const [pmi, setPmi] = useState(0);

  const downAmt = homePrice * (downPct / 100);
  const loanAmt = homePrice - downAmt;
  const monthlyRate = rate / 100 / 12;
  const payments = term * 12;
  const principal = monthlyRate === 0 ? loanAmt / payments
    : loanAmt * (monthlyRate * Math.pow(1+monthlyRate,payments)) / (Math.pow(1+monthlyRate,payments)-1);
  const autoPmi = downPct < 20 ? Math.round(loanAmt * 0.008 / 12) : 0;
  const effectivePmi = showAdvanced ? pmi : autoPmi;
  const total = principal + (showAdvanced ? taxes + insurance + hoa + pmi : effectivePmi);
  const totalInterest = (principal * payments) - loanAmt;

  const fmt = n => `$${Math.round(n).toLocaleString()}`;
  const inputStyle = { width:"100%", padding:"10px 12px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, fontFamily:ff, outline:"none", color:"#1a202c" };

  const breakdown = [
    { label:"Principal & Interest", val:principal, color:"#2563eb" },
    { label:"Property Tax", val: showAdvanced ? taxes : 400, color:"#7c3aed" },
    { label:"Home Insurance", val: showAdvanced ? insurance : 150, color:"#16a34a" },
    ...(effectivePmi > 0 ? [{ label:"PMI", val:effectivePmi, color:"#f59e0b" }] : []),
    ...(showAdvanced && hoa > 0 ? [{ label:"HOA", val:hoa, color:"#ea580c" }] : []),
  ];
  const totalBreakdown = breakdown.reduce((s,b) => s+b.val, 0);

  return (
    <div style={{ animation:"fadeUp 0.3s ease", maxWidth:800, margin:"0 auto" }}>
      <div style={{ marginBottom:18 }}>
        <span style={{ fontSize:22, fontWeight:800, color:"#1a202c", fontFamily:serif }}>🧮 Payment Calculator</span>
        <span style={{ fontSize:13, color:"#94a3b8", marginLeft:10, fontFamily:ff }}>Estimate your monthly mortgage payment</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Left — inputs */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", padding:"20px" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:14 }}>Basic Info</p>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Home Price</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#64748b", fontFamily:ff, fontSize:14 }}>$</span>
                <input type="number" value={homePrice} onChange={e=>setHomePrice(Number(e.target.value))} style={{...inputStyle, paddingLeft:26}}/>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"flex", justifyContent:"space-between", marginBottom:6, fontFamily:ff }}>
                Down Payment <span style={{ color:"#2563eb" }}>{downPct}% · {fmt(downAmt)}</span>
              </label>
              <input type="range" min={3} max={50} value={downPct} onChange={e=>setDownPct(Number(e.target.value))} style={{ width:"100%", accentColor:"#2563eb" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:3 }}>
                <span>3%</span><span>50%</span>
              </div>
              {downPct < 20 && <p style={{ fontSize:11, color:"#f59e0b", fontFamily:ff, marginTop:4 }}>⚠️ PMI applies when down payment is under 20%</p>}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"flex", justifyContent:"space-between", marginBottom:6, fontFamily:ff }}>
                Interest Rate <span style={{ color:"#2563eb" }}>{rate}%</span>
              </label>
              <input type="range" min={2} max={12} step={0.1} value={rate} onChange={e=>setRate(Number(e.target.value))} style={{ width:"100%", accentColor:"#2563eb" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:3 }}>
                <span>2%</span><span>12%</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Loan Term</label>
              <div style={{ display:"flex", gap:8 }}>
                {[10,15,20,30].map(t => (
                  <button key={t} onClick={() => setTerm(t)} style={{ flex:1, border:`1.5px solid ${term===t?"#2563eb":"#e2e8f0"}`, background:term===t?"#eff6ff":"#fff", color:term===t?"#2563eb":"#64748b", borderRadius:8, padding:"7px 0", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                    {t}yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced toggle */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden" }}>
            <button onClick={() => setShowAdvanced(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", border:"none", background:"none", cursor:"pointer", fontFamily:ff }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#475569" }}>⚙️ Advanced (taxes, insurance, HOA)</span>
              <span style={{ fontSize:12, color:"#94a3b8" }}>{showAdvanced?"▲ Hide":"▼ Show"}</span>
            </button>
            {showAdvanced && (
              <div style={{ padding:"0 18px 18px", display:"flex", flexDirection:"column", gap:12, borderTop:"1px solid #f1f5f9" }}>
                {[
                  {l:"Monthly Property Tax",v:taxes,s:setTaxes},
                  {l:"Home Insurance /mo",v:insurance,s:setInsurance},
                  {l:"HOA Fee /mo",v:hoa,s:setHoa},
                  {l:"PMI /mo (auto-calculated if blank)",v:pmi,s:setPmi},
                ].map(({l,v,s}) => (
                  <div key={l}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5, fontFamily:ff }}>{l}</label>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#64748b", fontFamily:ff, fontSize:14 }}>$</span>
                      <input type="number" value={v} onChange={e=>s(Number(e.target.value))} style={{...inputStyle, paddingLeft:26}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — results */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Monthly total */}
          <div style={{ background:"linear-gradient(135deg,#2563eb,#1d4ed8)", borderRadius:16, padding:"24px", textAlign:"center" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:8 }}>Est. Monthly Payment</p>
            <div style={{ fontSize:48, fontWeight:800, color:"#fff", fontFamily:serif, lineHeight:1 }}>{fmt(totalBreakdown)}</div>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontFamily:ff, marginTop:8 }}>per month · {term}-year fixed</p>
          </div>

          {/* Breakdown */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", padding:"18px" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:14 }}>Monthly Breakdown</p>
            {breakdown.map(b => (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:b.color, flexShrink:0 }}/>
                <span style={{ flex:1, fontSize:13, color:"#475569", fontFamily:ff }}>{b.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{fmt(b.val)}</span>
              </div>
            ))}
            {/* Visual bar */}
            <div style={{ height:8, borderRadius:4, overflow:"hidden", display:"flex", marginTop:8 }}>
              {breakdown.map(b => (
                <div key={b.label} style={{ flex: b.val/totalBreakdown, background:b.color, transition:"flex 0.3s" }}/>
              ))}
            </div>
          </div>

          {/* Loan summary */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", padding:"18px" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:14 }}>Loan Summary</p>
            {[
              {l:"Loan Amount", v:fmt(loanAmt)},
              {l:"Down Payment", v:`${fmt(downAmt)} (${downPct}%)`},
              {l:"Total Interest", v:fmt(totalInterest), highlight:true},
              {l:"Total Cost", v:fmt(loanAmt + totalInterest), highlight:true},
            ].map(({l,v,highlight}) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f8fafc" }}>
                <span style={{ fontSize:13, color:"#64748b", fontFamily:ff }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:700, color: highlight?"#dc2626":"#1a202c", fontFamily:ff }}>{v}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", border:"1.5px solid #ddd6fe", borderRadius:14, padding:"14px 16px", textAlign:"center" }}>
            <p style={{ fontSize:13, color:"#6d28d9", fontFamily:ff, marginBottom:10 }}>🏦 Ready to get pre-approved? Connect with a verified mortgage broker on Chathouse.</p>
            <button style={{ background:"#7c3aed", color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:ff }}>Find a Broker →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function MapView({ listings, onOpen }) {
  const [hov, setHov] = useState(null);
  const px = (lat, lng) => ({ x:((lng-(-74.5))/((-73.5)-(-105)))*92+4, y:((42-lat)/(42-25))*90+5 });

  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:24 }}>
      <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:8 }}>
        <span>🗺️</span>
        <span style={{ fontWeight:700, fontSize:14, color:"#1a202c", fontFamily:ff }}>Map View</span>
        <span style={{ fontSize:12, color:"#94a3b8", fontFamily:ff }}>— {listings.length} listings · hover to preview · click to open</span>
      </div>
      <div style={{ position:"relative", height:340, background:"linear-gradient(150deg,#dbeafe 0%,#e0f2fe 50%,#ede9fe 100%)", overflow:"hidden" }}>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.1 }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 55 Q30 48 60 58 Q80 65 100 55" stroke="#475569" strokeWidth="0.7" fill="none"/>
          <path d="M0 35 Q25 30 55 40 Q80 46 100 38" stroke="#475569" strokeWidth="0.4" fill="none"/>
          {[18,42,68,88].map(x => <line key={x} x1={x} y1="0" x2={x-2} y2="100" stroke="#475569" strokeWidth="0.3"/>)}
        </svg>
        {[{l:"TX",x:24,y:72},{l:"GA",x:80,y:42},{l:"FL",x:76,y:84},{l:"NC",x:83,y:32},{l:"CO",x:30,y:20},{l:"NY",x:92,y:18}].map((s,i) => (
          <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, fontSize:9, color:"#94a3b8", fontWeight:700, transform:"translate(-50%,-50%)", pointerEvents:"none", letterSpacing:1, fontFamily:ff }}>{s.l}</div>
        ))}
        {listings.map(l => {
          const p = px(l.lat, l.lng); const isH = hov===l.id;
          const isRent = l.type==="rent";
          return (
            <div key={l.id} onClick={() => onOpen(l)} onMouseEnter={() => setHov(l.id)} onMouseLeave={() => setHov(null)}
              style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, transform:"translate(-50%,-100%)", cursor:"pointer", zIndex:isH?10:1 }}>
              <div style={{ background:isH?(isRent?"#ea580c":"#2563eb"):"#fff", color:isH?"#fff":"#1a202c", border:`2px solid ${isH?(isRent?"#ea580c":"#2563eb"):"#cbd5e1"}`, borderRadius:isH?10:20, padding:"4px 10px", fontSize:11, fontWeight:800, whiteSpace:"nowrap", boxShadow:"0 2px 12px rgba(0,0,0,0.15)", transition:"all 0.2s", fontFamily:ff }}>
                {isRent?`$${l.price.toLocaleString()}/mo`:`$${(l.price/1000).toFixed(0)}k`}
              </div>
              <div style={{ width:8, height:8, background:isH?(isRent?"#ea580c":"#2563eb"):"#fff", border:`2px solid ${isH?(isRent?"#ea580c":"#2563eb"):"#cbd5e1"}`, borderRadius:"50%", margin:"0 auto", marginTop:-1, boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
              {isH && (
                <div style={{ position:"absolute", top:"115%", left:"50%", transform:"translateX(-50%)", background:"#fff", border:"1px solid #e8eaed", borderRadius:12, padding:"10px 14px", width:210, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", zIndex:20, fontFamily:ff }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", marginBottom:2 }}>{l.address}</div>
                  <div style={{ fontSize:11, color:"#64748b" }}>{l.beds}bd · {l.baths}ba · {l.sqft.toLocaleString()} sqft</div>
                  <div style={{ fontSize:14, fontWeight:800, color:isRent?"#ea580c":"#2563eb", marginTop:5, fontFamily:serif }}>{formatPrice(l)}</div>
                  <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>📍 {l.hood} · {l.city}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI NEIGHBORHOOD SUMMARY ──────────────────────────────────────────────────
function AISummary({ listing }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (text) { setOpen(o => !o); return; }
    setOpen(true); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are a friendly, knowledgeable real estate neighborhood analyst. Write exactly 3 short paragraphs with NO headers or bullet points: 1) Neighborhood vibe and character 2) Practical info like schools, commute, and walkability 3) Who this ${listing.type==="rent"?"apartment":"home"} is best suited for. Be specific, honest, and conversational. 2-3 sentences per paragraph. Plain text only.`,
          messages:[{ role:"user", content:`Neighborhood: ${listing.hood}, ${listing.city}. ${listing.type==="rent"?"Rental":"Home"}: ${listing.address}, ${formatPrice(listing)}, ${listing.beds}bd/${listing.baths}ba, ${listing.sqft}sqft.` }]
        })
      });
      const data = await res.json();
      setText(data.content?.[0]?.text || "Could not load summary.");
    } catch { setText("Unable to load neighborhood summary right now."); }
    setLoading(false);
  };

  return (
    <div style={{ marginTop:14 }}>
      <button onClick={load} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left", background:open?"#eff6ff":"#f8fafc", border:`1.5px solid ${open?"#2563eb":"#e8eaed"}`, borderRadius:10, padding:"9px 14px", cursor:"pointer", transition:"all 0.2s", fontFamily:ff }}>
        <span style={{ fontSize:16 }}>✨</span>
        <span style={{ fontSize:13, fontWeight:700, color:open?"#2563eb":"#475569" }}>AI Neighborhood Summary — {listing.hood}</span>
        <span style={{ marginLeft:"auto", color:"#94a3b8", fontSize:12 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ background:"#f8fafc", border:"1.5px solid #e8eaed", borderTop:"none", borderRadius:"0 0 10px 10px", padding:"14px 16px" }}>
          {loading
            ? <div style={{ display:"flex", alignItems:"center", gap:10, color:"#64748b", fontSize:13, fontFamily:ff }}>
                <div style={{ width:14, height:14, border:"2px solid #2563eb", borderTop:"2px solid transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
                Analyzing {listing.hood}...
              </div>
            : <p style={{ fontSize:13, color:"#334155", lineHeight:1.75, fontFamily:ff, whiteSpace:"pre-wrap" }}>{text}</p>
          }
        </div>
      )}
    </div>
  );
}

// ─── COMMENT DRAWER ───────────────────────────────────────────────────────────
const ROLES_SALE = [
  { value:"buyer",      label:"🏠 Potential Buyer",  color:"#2563eb" },
  { value:"past_owner", label:"🔑 Past Owner",        color:"#16a34a" },
  { value:"neighbor",   label:"👋 Neighbor",          color:"#7c3aed" },
  { value:"investor",   label:"💼 Investor",          color:"#f59e0b" },
  { value:"agent",      label:"🤝 Agent",             color:"#0ea5e9" },
  { value:"other",      label:"💬 Just Commenting",   color:"#64748b" },
];
const ROLES_RENT = [
  { value:"past_tenant", label:"🏢 Past Tenant", color:"#ea580c" },
  { value:"current_tenant", label:"🗝️ Current Tenant", color:"#16a34a" },
  { value:"neighbor", label:"👋 Neighbor", color:"#7c3aed" },
  { value:"prospective", label:"🔍 Prospective Renter", color:"#2563eb" },
  { value:"other", label:"💬 Just Commenting", color:"#64748b" },
];

function Drawer({ listing, user, saved, onSave, onClose, onConnect }) {
  const [comments, setComments] = useState(listing.comments);
  const [txt, setTxt] = useState("");
  const [liked, setLiked] = useState(false);
  const [lc, setLc] = useState(listing.likes);
  const [cLikes, setCLikes] = useState({});
  const [showRoles, setShowRoles] = useState(false);
  const [activeCommenter, setActiveCommenter] = useState(null);
  const [connected, setConnected] = useState({});
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifiedAddresses, setVerifiedAddresses] = useState([]);
  const [pendingRole, setPendingRole] = useState("");
  const [commentVisibility, setCommentVisibility] = useState("public");
  const [verifyDoc, setVerifyDoc] = useState(null);
  const [commentSearch, setCommentSearch] = useState("");
  const [showCommentSearch, setShowCommentSearch] = useState(false);
  const verifyDocRef = useRef();
  const searchInputRef = useRef();
  const endRef = useRef();
  const isRent = listing.type==="rent";
  const ROLES = isRent ? ROLES_RENT : ROLES_SALE;

  // Pro accounts get a permanent role tied to their account type
  const PRO_ROLES = {
    agent:      { value:"agent_pro",      label:"🤝 Agent",            color:"#16a34a" },
    broker:     { value:"broker_pro",     label:"🏦 Mortgage Broker",  color:"#7c3aed" },
    landlord:   { value:"landlord_pro",   label:"🏡 Landlord",         color:"#ea580c" },
    management: { value:"management_pro", label:"🏢 Property Manager", color:"#dc2626" },
  };
  const proRole = user && PRO_ROLES[user.accountType] ? PRO_ROLES[user.accountType] : null;

  // Role state — pre-set for pro accounts, manual for buyers
  const [role, setRole] = useState(proRole ? proRole.value : "");
  const selectedRole = proRole || ROLES.find(r => r.value===role);
  const isTenantRole = role==="past_tenant" || role==="current_tenant";
  const isVerified = verifiedAddresses.includes(listing.address);

  // Map comment avatars to community profiles for clickable cards
  const getCommunityProfile = (av, name) =>
    MOCK_COMMUNITY.find(m => m.av === av) ||
    { name, av, city:"New York, NY", lookingFor:"Not specified", bio:"Community member on Chathouse.", mutualListings:1, friendStatus:"none" };

  const handleRoleSelect = (r) => {
    const isTenant = r==="past_tenant" || r==="current_tenant";
    if (isTenant && !verifiedAddresses.includes(listing.address)) {
      setPendingRole(r);
      setVerifyStep(1);
      setVerifyDoc(null);
      setShowVerifyModal(true);
    } else {
      setRole(r);
    }
  };

  const completeVerification = () => {
    setVerifiedAddresses(p => [...p, listing.address]);
    setRole(pendingRole);
    setShowVerifyModal(false);
    setPendingRole("");
  };

  const post = () => {
    if (!txt.trim() || !role) return;
    const isAnon = isTenantRole && commentVisibility==="anonymous";
    const displayRole = proRole || ROLES.find(r => r.value===role);
    setComments(c => [...c, {
      id:Date.now(),
      user: isAnon ? "Anonymous Tenant" : user.name,
      av: isAnon ? "A" : user.av,
      time:"Just now",
      text:txt.trim(),
      likes:0,
      role,
      roleLabel: displayRole?.label || "",
      verified: isTenantRole && isVerified,
      anonymous: isAnon,
    }]);
    setTxt("");
    if (!proRole) setRole("");
    setCommentVisibility("public");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), 80);
  };

  const handleConnect = (profile) => {
    setConnected(p => ({...p, [profile.av]:true}));
    if (onConnect) onConnect(profile);
    setTimeout(() => setActiveCommenter(null), 800);
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(10,20,40,0.55)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(5px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:"22px 22px 0 0", width:"100%", maxWidth:680, maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 -12px 60px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>

      {/* TENANCY VERIFICATION MODAL */}
      {showVerifyModal && (
        <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", inset:0, background:"rgba(10,20,40,0.6)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"22px 22px 0 0", backdropFilter:"blur(4px)" }}>
          <div style={{ background:"#fff", borderRadius:18, width:"90%", maxWidth:400, padding:"28px 24px", animation:"fadeUp 0.25s ease" }}>
            {/* Step indicator */}
            <div style={{ display:"flex", gap:6, marginBottom:20 }}>
              {[1,2].map(s => (
                <div key={s} style={{ flex:1, height:3, borderRadius:2, background: verifyStep>=s?"#2563eb":"#e2e8f0", transition:"background 0.3s" }}/>
              ))}
            </div>

            {verifyStep===1 && (
              <>
                <div style={{ fontSize:20, marginBottom:6 }}>🏠</div>
                <div style={{ fontSize:16, fontWeight:800, color:"#1a202c", fontFamily:serif, marginBottom:6 }}>One quick step before you share</div>
                <p style={{ fontSize:13, color:"#64748b", fontFamily:ff, lineHeight:1.6, marginBottom:16 }}>
                  Your experience as a <strong>{pendingRole==="current_tenant"?"current tenant":"past tenant"}</strong> at <strong>{listing.address}</strong> means a lot to this community. To keep things trustworthy for everyone, we just need a quick document to confirm your connection to this address. It only takes a second and you'll never have to do it again for this listing.
                </p>
                <div style={{ background:"#f8fafc", borderRadius:10, padding:"10px 14px", marginBottom:16, border:"1px solid #f1f5f9" }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#475569", fontFamily:ff, marginBottom:6 }}>Any of these work:</p>
                  {["Lease agreement or renewal","Utility bill with your name & address","Bank statement showing your address","Government ID with matching address"].map(d => (
                    <p key={d} style={{ fontSize:12, color:"#64748b", fontFamily:ff, marginBottom:3 }}>✓ {d}</p>
                  ))}
                </div>
                <input ref={verifyDocRef} type="file" accept="image/*,.pdf" onChange={e => setVerifyDoc(e.target.files?.[0]||null)} style={{ display:"none" }}/>
                {verifyDoc ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#f0fdf4", borderRadius:10, border:"1.5px solid #bbf7d0", marginBottom:16 }}>
                    <span style={{ fontSize:20 }}>📄</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#15803d", fontFamily:ff }}>✓ Got it — looks good!</div>
                      <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{verifyDoc.name}</div>
                    </div>
                    <button onClick={() => setVerifyDoc(null)} style={{ border:"none", background:"none", cursor:"pointer", color:"#94a3b8", fontSize:13 }}>✕</button>
                  </div>
                ) : (
                  <div onClick={() => verifyDocRef.current?.click()} style={{ border:"2px dashed #bfdbfe", borderRadius:12, padding:"18px", textAlign:"center", cursor:"pointer", background:"#eff6ff", marginBottom:16 }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#2563eb"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#bfdbfe"}>
                    <div style={{ fontSize:24, marginBottom:4 }}>📎</div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#2563eb", fontFamily:ff }}>Upload your document</div>
                    <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:2 }}>PDF, JPG or PNG · Max 10MB</div>
                  </div>
                )}
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setShowVerifyModal(false)} style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Cancel</button>
                  <button onClick={() => setVerifyStep(2)} disabled={!verifyDoc} style={{ flex:2, background:verifyDoc?"#2563eb":"#e2e8f0", color:verifyDoc?"#fff":"#94a3b8", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:700, cursor:verifyDoc?"pointer":"default", fontFamily:ff, transition:"all 0.2s" }}>Continue →</button>
                </div>
              </>
            )}

            {verifyStep===2 && (
              <>
                <div style={{ fontSize:20, marginBottom:6 }}>✨</div>
                <div style={{ fontSize:16, fontWeight:800, color:"#1a202c", fontFamily:serif, marginBottom:6 }}>You're verified — now choose how to post</div>
                <p style={{ fontSize:13, color:"#64748b", fontFamily:ff, lineHeight:1.6, marginBottom:16 }}>
                  Your experience is valuable and the community is lucky to have it. Choose how you'd like your name to appear — either way, your <strong>✓ Verified Tenant</strong> badge will show so people know your comment is genuine.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                  {[
                    { v:"public", icon:"👤", title:"Post with my name", desc:`Shown as ${user.name} · ${pendingRole==="current_tenant"?"🗝️ Current Tenant":"🏢 Past Tenant"} ✓ Verified`, color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
                    { v:"anonymous", icon:"🕵️", title:"Post anonymously", desc:`Shown as Anonymous Tenant · ${pendingRole==="current_tenant"?"🗝️ Current Tenant":"🏢 Past Tenant"} ✓ Verified`, color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
                  ].map(opt => (
                    <label key={opt.v} onClick={() => setCommentVisibility(opt.v)} style={{ display:"flex", gap:12, padding:"12px 14px", border:`2px solid ${commentVisibility===opt.v?opt.color:"#e2e8f0"}`, borderRadius:12, cursor:"pointer", background:commentVisibility===opt.v?opt.bg:"#fff", transition:"all 0.15s" }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${commentVisibility===opt.v?opt.color:"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                        {commentVisibility===opt.v && <div style={{ width:9, height:9, borderRadius:"50%", background:opt.color }}/>}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{opt.icon} {opt.title}</div>
                        <div style={{ fontSize:11, color:"#64748b", fontFamily:ff, marginTop:2 }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
                  <p style={{ fontSize:11, color:"#15803d", fontFamily:ff }}>🔒 Your document is stored securely and kept completely private. It is never shared with anyone, including property managers — it simply helps us keep the community trustworthy for everyone.</p>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setVerifyStep(1)} style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>← Back</button>
                  <button onClick={completeVerification} style={{ flex:2, background:"#2563eb", color:"#fff", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:ff }}>✓ Done — let me post!</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
        <div style={{ display:"flex", justifyContent:"center", paddingTop:12 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#e2e8f0" }}/>
        </div>
        <div style={{ position:"relative", height:160, margin:"12px 16px 0", borderRadius:14, overflow:"hidden", flexShrink:0 }}>
          <img src={listing.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(transparent 30%, rgba(0,0,0,0.65))" }}/>
          <div style={{ position:"absolute", bottom:12, left:14 }}>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff", fontFamily:serif }}>{formatPrice(listing)}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginTop:2, fontFamily:ff }}>{listing.address} · {listing.city}</div>
          </div>
          <div style={{ position:"absolute", top:10, right:10, display:"flex", gap:6, alignItems:"center" }}>
            <Badge source={listing.source} type={listing.type}/>
            <button onClick={onClose} style={{ border:"none", background:"rgba(255,255,255,0.2)", borderRadius:8, width:28, height:28, cursor:"pointer", color:"#fff", fontSize:14, backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", flexShrink:0 }}>
          <div style={{ display:"flex", gap:16, marginBottom:12, flexWrap:"wrap" }}>
            {[{v:listing.beds,l:"Beds"},{v:listing.baths,l:"Baths"},{v:listing.sqft.toLocaleString(),l:"Sq Ft"},{v:listing.hood,l:"Neighborhood"}].map(({v,l}) => (
              <div key={l}>
                <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{v} </span>
                <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={() => { setLiked(x => !x); setLc(c => liked?c-1:c+1); }} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 16px", borderRadius:20, border:`1.5px solid ${liked?"#2563eb":"#e2e8f0"}`, background:liked?"#eff6ff":"#fff", color:liked?"#2563eb":"#64748b", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
              {liked?"♥":"♡"} {lc}
            </button>
            <button onClick={onSave} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 16px", borderRadius:20, border:`1.5px solid ${saved?"#f59e0b":"#e2e8f0"}`, background:saved?"#fffbeb":"#fff", color:saved?"#d97706":"#64748b", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
              {saved?"🔖 Saved":"🔖 Save"}
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginLeft:4 }}>
              <span style={{ fontSize:13, color:"#94a3b8", fontFamily:ff }}>💬 {comments.length}</span>
              <button onClick={() => {
                setShowCommentSearch(o => !o);
                setCommentSearch("");
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }} style={{ border:"none", background: showCommentSearch?"#eff6ff":"transparent", borderRadius:8, padding:"4px 8px", cursor:"pointer", fontSize:13, color: showCommentSearch?"#2563eb":"#94a3b8", display:"flex", alignItems:"center", gap:4, fontFamily:ff, fontWeight:600 }}>
                🔍 {showCommentSearch ? "Search" : ""}
              </button>
            </div>
            <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:listing.tagColor, background:`${listing.tagColor}18`, padding:"4px 10px", borderRadius:20, fontFamily:ff }}>{listing.tag}</span>
          </div>
          <AISummary listing={listing}/>
        </div>

        {/* Expandable comment search bar */}
        {showCommentSearch && (
          <div style={{ padding:"0 18px 10px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f8fafc", borderRadius:12, border:"1.5px solid #2563eb", padding:"8px 12px" }}>
              <span style={{ fontSize:14, color:"#94a3b8" }}>🔍</span>
              <input
                ref={searchInputRef}
                value={commentSearch}
                onChange={e => setCommentSearch(e.target.value)}
                placeholder="Search comments — try 'pest', 'parking', 'heat', 'pet'..."
                style={{ flex:1, border:"none", background:"transparent", outline:"none", fontSize:13, color:"#1a202c", fontFamily:ff }}
              />
              {commentSearch && (
                <button onClick={() => setCommentSearch("")} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:"#94a3b8", padding:0 }}>✕</button>
              )}
            </div>
            {commentSearch && (
              <p style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:5 }}>
                {comments.filter(c => c.text.toLowerCase().includes(commentSearch.toLowerCase()) || c.user.toLowerCase().includes(commentSearch.toLowerCase())).length} result{comments.filter(c => c.text.toLowerCase().includes(commentSearch.toLowerCase()) || c.user.toLowerCase().includes(commentSearch.toLowerCase())).length !== 1 ? "s" : ""} for "{commentSearch}"
              </p>
            )}
          </div>
        )}

        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", position:"relative" }}>
          {(() => {
            const filtered = commentSearch.trim()
              ? comments.filter(c => c.text.toLowerCase().includes(commentSearch.toLowerCase()) || c.user.toLowerCase().includes(commentSearch.toLowerCase()))
              : comments;
            const query = commentSearch.toLowerCase().trim();

            const highlight = (text) => {
              if (!query) return text;
              const idx = text.toLowerCase().indexOf(query);
              if (idx === -1) return text;
              return (
                <>
                  {text.slice(0, idx)}
                  <mark style={{ background:"#fef08a", borderRadius:3, padding:"0 1px" }}>{text.slice(idx, idx+query.length)}</mark>
                  {text.slice(idx+query.length)}
                </>
              );
            };

            if (filtered.length === 0) return (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8", fontSize:14, fontFamily:ff }}>
                No comments match "{commentSearch}"
              </div>
            );

            return filtered.map(c => {
            const isOwnComment = c.av === user?.av;
            const profile = !isOwnComment ? getCommunityProfile(c.av, c.user) : null;
            return (
              <div key={c.id} style={{ display:"flex", gap:12, marginBottom:20 }}>
                <div onClick={() => !isOwnComment && setActiveCommenter(profile)} style={{ cursor: isOwnComment ? "default" : "pointer", flexShrink:0 }}>
                  <Av letter={c.av} size={36}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                    <span onClick={() => !isOwnComment && setActiveCommenter(profile)}
                      style={{ fontSize:13, fontWeight:700, color: isOwnComment ? "#1a202c" : "#2563eb", fontFamily:ff, cursor: isOwnComment ? "default" : "pointer", textDecoration: isOwnComment ? "none" : "underline", textDecorationColor:"#bfdbfe" }}>
                      {c.user}
                    </span>
                    {c.roleLabel && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#f1f5f9", color:"#475569", fontFamily:ff }}>{c.roleLabel}</span>}
                    {c.verified && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#f0fdf4", color:"#15803d", border:"1px solid #bbf7d0", fontFamily:ff }}>✓ Verified Tenant</span>}
                    {c.anonymous && <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>· anonymous</span>}
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize:14, color:"#334155", lineHeight:1.55, marginBottom:6, fontFamily:ff }}>{highlight(c.text)}</p>
                  <button onClick={() => setCLikes(p => ({...p,[c.id]:!p[c.id]}))} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:cLikes[c.id]?"#2563eb":"#94a3b8", fontWeight:600, padding:0, fontFamily:ff }}>
                    {cLikes[c.id]?"♥":"♡"} {c.likes+(cLikes[c.id]?1:0)}
                  </button>
                  {c.officialResponse && (
                    <div style={{ marginTop:10, background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:10, padding:"10px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#ea580c", color:"#fff", fontFamily:ff }}>🏢 Official Response</span>
                        <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{c.officialResponse.time}</span>
                      </div>
                      <p style={{ fontSize:13, color:"#7c2d12", lineHeight:1.55, fontFamily:ff, marginBottom:4 }}>{c.officialResponse.text}</p>
                      <p style={{ fontSize:11, color:"#ea580c", fontWeight:600, fontFamily:ff }}>{c.officialResponse.manager}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          });
          })()}
          <div ref={endRef}/>

          {/* Mini commenter profile card */}
          {activeCommenter && (
            <div style={{ position:"sticky", bottom:0, left:0, right:0, zIndex:50, animation:"fadeUp 0.2s ease" }}>
              <div style={{ background:"#fff", borderRadius:"16px 16px 0 0", border:"1.5px solid #e8eaed", borderBottom:"none", boxShadow:"0 -8px 32px rgba(0,0,0,0.12)", padding:"16px 18px" }}>
                {/* Handle + close */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div style={{ width:32, height:3, borderRadius:2, background:"#e2e8f0", margin:"0 auto 0 0" }}/>
                  <button onClick={() => setActiveCommenter(null)} style={{ border:"none", background:"#f1f5f9", borderRadius:8, width:26, height:26, cursor:"pointer", fontSize:13, color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
                {/* Profile info */}
                <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
                  <Av letter={activeCommenter.av} size={48}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff, marginBottom:2 }}>{activeCommenter.name}</div>
                    <div style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>📍 {activeCommenter.city}
                      {activeCommenter.movingFrom && activeCommenter.movingFrom !== activeCommenter.city
                        ? ` · Moving from ${activeCommenter.movingFrom}` : ""}
                    </div>
                    <div style={{ fontSize:12, color:"#64748b", fontFamily:ff, marginTop:2 }}>🏠 Looking for: {activeCommenter.lookingFor}</div>
                  </div>
                </div>
                <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, fontFamily:ff, marginBottom:12 }}>{activeCommenter.bio}</p>
                {activeCommenter.mutualListings > 0 && (
                  <div style={{ fontSize:12, color:"#7c3aed", fontWeight:600, fontFamily:ff, marginBottom:12 }}>
                    💬 You've both commented on {activeCommenter.mutualListings} listing{activeCommenter.mutualListings>1?"s":""} including this one
                  </div>
                )}
                {/* Action buttons */}
                <div style={{ display:"flex", gap:8 }}>
                  {connected[activeCommenter.av] ? (
                    <div style={{ flex:1, background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:10, padding:"10px", textAlign:"center", fontSize:13, fontWeight:700, color:"#16a34a", fontFamily:ff }}>
                      ✓ Request Sent!
                    </div>
                  ) : (
                    <button onClick={() => handleConnect(activeCommenter)} style={{ flex:1, background:"#2563eb", color:"#fff", border:"none", borderRadius:10, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:ff }}>
                      + Connect with {activeCommenter.name.split(" ")[0]}
                    </button>
                  )}
                  <button onClick={() => setActiveCommenter(null)} style={{ background:"#f8fafc", color:"#64748b", border:"1.5px solid #e8eaed", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding:"10px 18px 20px", borderTop:"1px solid #f1f5f9", flexShrink:0 }}>

          {/* Pro accounts — permanent locked role badge, no selector */}
          {proRole ? (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, padding:"4px 14px", borderRadius:20, background:`${proRole.color}15`, color:proRole.color, border:`1.5px solid ${proRole.color}30`, fontFamily:ff }}>
                {proRole.label}
              </span>
              <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>· Your account badge</span>
            </div>
          ) : (
            /* Buyer accounts — mandatory role selector */
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", fontFamily:ff }}>Who are you?</span>
                <span style={{ fontSize:10, fontWeight:700, color:"#dc2626", fontFamily:ff }}>Required</span>
              </div>
              {!selectedRole ? (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {ROLES.map(r => (
                    <button key={r.value} onClick={() => handleRoleSelect(r.value)} style={{ border:`1.5px solid ${r.color}30`, borderRadius:20, padding:"5px 12px", background:`${r.color}08`, cursor:"pointer", fontSize:12, fontWeight:600, color:r.color, fontFamily:ff, transition:"all 0.15s" }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:`${selectedRole.color}15`, color:selectedRole.color, fontFamily:ff }}>
                      {selectedRole.label}
                      {isTenantRole && isVerified && <span style={{ marginLeft:6, fontSize:10, color:"#15803d" }}>✓ Verified</span>}
                    </span>
                    <button onClick={() => setRole("")} style={{ border:"none", background:"none", fontSize:11, color:"#94a3b8", cursor:"pointer", fontFamily:ff }}>Change</button>
                  </div>
                  {/* Visibility toggle — only for verified tenants */}
                  {isTenantRole && isVerified && (
                    <div style={{ display:"flex", gap:8 }}>
                      {[{v:"public",l:"👤 Post publicly"},{v:"anonymous",l:"🕵️ Post anonymously"}].map(({v,l}) => (
                        <button key={v} onClick={() => setCommentVisibility(v)} style={{ fontSize:11, fontWeight:600, padding:"5px 12px", borderRadius:20, border:`1.5px solid ${commentVisibility===v?"#2563eb":"#e2e8f0"}`, background:commentVisibility===v?"#eff6ff":"#fff", color:commentVisibility===v?"#2563eb":"#64748b", cursor:"pointer", fontFamily:ff, transition:"all 0.15s" }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
            <Av letter={user.av} size={32}/>
            <div style={{ flex:1, background:"#f8fafc", borderRadius:14, border:"1.5px solid #e8eaed", padding:"9px 12px", display:"flex", gap:8, alignItems:"flex-end", transition:"all 0.2s" }}>
              <textarea value={txt} onChange={e => setTxt(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();post();} }}
                placeholder={
                  proRole
                    ? `Comment as ${proRole.label}...`
                    : !selectedRole
                      ? "Select your role above before commenting..."
                      : isRent ? "Share your experience as a "+selectedRole.label+"..." : "Share your thoughts as a "+selectedRole.label+"..."
                }
                disabled={!proRole && !selectedRole}
                rows={1}
                style={{ flex:1, border:"none", background:"transparent", resize:"none", outline:"none", fontSize:14, color:"#1a202c", lineHeight:1.5, maxHeight:96, overflowY:"auto", fontFamily:ff, cursor:(proRole||selectedRole)?"text":"not-allowed", opacity:(proRole||selectedRole)?1:0.5 }}/>
              <button onClick={post} disabled={!txt.trim() || (!proRole && !selectedRole)} style={{ background:txt.trim()&&(proRole||selectedRole)?"#2563eb":"#e2e8f0", color:txt.trim()&&(proRole||selectedRole)?"#fff":"#94a3b8", border:"none", borderRadius:9, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:txt.trim()&&(proRole||selectedRole)?"pointer":"default", flexShrink:0, transition:"all 0.15s", fontFamily:ff }}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function Card({ listing, onOpen, saved, onSave }) {
  const [liked, setLiked] = useState(false);
  const [lc, setLc] = useState(listing.likes);
  const isRent = listing.type==="rent";

  return (
    <div onClick={() => onOpen(listing)} style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.05)", cursor:"pointer", border:`1px solid ${isRent?"#fed7aa":"#e8eaed"}`, transition:"transform 0.2s,box-shadow 0.2s", animation:"fadeUp 0.4s ease both" }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.05)"; }}>
      <div style={{ position:"relative", height:192, overflow:"hidden" }}>
        <img src={listing.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
          onMouseEnter={e => e.target.style.transform="scale(1.04)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}/>
        <div style={{ position:"absolute", top:10, left:10 }}>
          <span style={{ background:listing.tagColor, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, fontFamily:ff }}>{listing.tag}</span>
        </div>
        <div style={{ position:"absolute", top:10, right:40 }}><Badge source={listing.source} type={listing.type}/></div>
        <button onClick={e => { e.stopPropagation(); onSave(listing.id); }} style={{ position:"absolute", top:8, right:9, border:"none", background:saved?"#fef3c7":"rgba(255,255,255,0.88)", borderRadius:8, width:29, height:29, cursor:"pointer", fontSize:14, backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}>🔖</button>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:48, background:"linear-gradient(transparent,rgba(0,0,0,0.3))" }}/>
        <div style={{ position:"absolute", bottom:7, left:11, fontSize:10, color:"rgba(255,255,255,0.9)", fontWeight:600, fontFamily:ff }}>📍 {listing.hood}</div>
      </div>
      <div style={{ padding:"13px 15px 11px" }}>
        <div style={{ fontSize:21, fontWeight:800, color:isRent?"#ea580c":"#1a202c", fontFamily:serif, letterSpacing:-0.3, marginBottom:2 }}>{formatPrice(listing)}</div>
        <div style={{ fontSize:13, fontWeight:600, color:"#1e293b", marginBottom:1, fontFamily:ff }}>{listing.address}</div>
        <div style={{ fontSize:12, color:"#64748b", marginBottom:11, fontFamily:ff }}>{listing.city} {listing.zip}</div>
        <div style={{ display:"flex", gap:12, marginBottom:11 }}>
          {[{v:listing.beds,l:"Beds"},{v:listing.baths,l:"Baths"},{v:listing.sqft.toLocaleString(),l:"Sq Ft"}].map(({v,l}) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{v}</div>
              <div style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:9, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={e => { e.stopPropagation(); setLiked(x=>!x); setLc(c=>liked?c-1:c+1); }} style={{ display:"flex", alignItems:"center", gap:5, border:"none", background:liked?"#eff6ff":"transparent", color:liked?"#2563eb":"#64748b", cursor:"pointer", padding:"4px 9px", borderRadius:8, fontSize:13, fontWeight:600, fontFamily:ff, transition:"all 0.15s" }}>
              <span>{liked?"♥":"♡"}</span> {lc}
            </button>
            <button onClick={e => { e.stopPropagation(); onOpen(listing); }} style={{ display:"flex", alignItems:"center", gap:5, border:"none", background:"transparent", color:"#64748b", cursor:"pointer", padding:"4px 9px", borderRadius:8, fontSize:13, fontWeight:600, fontFamily:ff }}>
              💬 {listing.comments.length}
            </button>
          </div>
          <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{listing.daysAgo===0?"Today":`${listing.daysAgo}d ago`}</span>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ onAuth, onClose }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1); // step 1 = account type, step 2 = details
  const [accountType, setAccountType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [city, setCity] = useState("New York, NY");
  const [av, setAv] = useState("A");
  // Agent fields
  const [licenseNum, setLicenseNum] = useState("");
  const [agentBrokerage, setAgentBrokerage] = useState("");
  const [agentTier, setAgentTier] = useState("pro");
  // Broker fields
  const [brokerCompany, setBrokerCompany] = useState("");
  const [brokerPhone, setBrokerPhone] = useState("");
  const [brokerLicense, setBrokerLicense] = useState("");
  const [brokerTier, setBrokerTier] = useState("pro");
  // Management fields
  const [mgmtCompany, setMgmtCompany] = useState("");
  const [mgmtPhone, setMgmtPhone] = useState("");
  const [mgmtTier, setMgmtTier] = useState("pro");
  const [mgmtVerifyDoc, setMgmtVerifyDoc] = useState(null);
  const [mgmtVerifyType, setMgmtVerifyType] = useState("");
  const mgmtDocRef = useRef();
  // Photo upload
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  // Buyer fields
  const [hasBroker, setHasBroker] = useState("");
  const [hasAgent, setHasAgent] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [linkedAgent, setLinkedAgent] = useState(null);
  const agentResults = agentSearch.length > 1
    ? MOCK_AGENTS.filter(a =>
        a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
        a.license.toLowerCase().includes(agentSearch.toLowerCase()) ||
        a.brokerage.toLowerCase().includes(agentSearch.toLowerCase())
      )
    : [];

  const letters = ["A","B","C","D","J","K","L","M","N","P","S","T"];
  const inputStyle = { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, outline:"none", color:"#1a202c", fontFamily:ff };

  const submit = () => {
    if (!email||!pass) return;
    if (mode==="register"&&!name) return;
    if (mode==="register" && accountType==="agent" && (!licenseNum.trim() || !profilePhoto)) return;
    if (mode==="register" && accountType==="broker" && (!brokerLicense.trim() || !profilePhoto)) return;
    if (mode==="register" && accountType==="management" && (!mgmtCompany.trim() || !mgmtVerifyDoc)) return;
    onAuth({ name:name||email.split("@")[0], email, av, city, accountType:accountType||"buyer", licenseNum, agentBrokerage, agentTier, brokerCompany, brokerPhone, brokerLicense, brokerTier, hasBroker, hasAgent, linkedAgent, photoPreview, managementCompany:mgmtCompany, mgmtPhone, managementTier:mgmtTier });
  };

  const canProceed = mode==="login" || (accountType !== "");

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,20,40,0.6)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#fff", borderRadius:22, width:"100%", maxWidth:460, padding:"32px", boxShadow:"0 24px 64px rgba(0,0,0,0.22)", position:"relative", animation:"fadeUp 0.3s ease", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, border:"none", background:"#f1f5f9", borderRadius:8, width:30, height:30, cursor:"pointer", fontSize:15, color:"#64748b" }}>✕</button>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <div style={{ width:36, height:36, background:"#2563eb", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏠</div>
          <span style={{ fontSize:20, fontWeight:800, color:"#1a202c", fontFamily:serif }}>Chathouse</span>
        </div>

        {/* Login / Register toggle */}
        <div style={{ display:"flex", background:"#f1f5f9", borderRadius:10, padding:4, marginBottom:22, gap:4 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setStep(1); setAccountType(""); }} style={{ flex:1, border:"none", background:mode===m?"#fff":"transparent", borderRadius:8, padding:"8px", fontSize:13, fontWeight:700, cursor:"pointer", color:mode===m?"#1a202c":"#64748b", boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none", transition:"all 0.2s", fontFamily:ff }}>
              {m==="login"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>

        {/* REGISTER FLOW */}
        {mode==="register" && step===1 && (
          <>
            <p style={{ fontSize:14, fontWeight:700, color:"#1a202c", marginBottom:4, fontFamily:ff }}>I am a...</p>
            <p style={{ fontSize:12, color:"#94a3b8", marginBottom:16, fontFamily:ff }}>Choose the account type that best describes you</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {ACCOUNT_TYPES.map(type => (
                <label key={type.value} onClick={() => setAccountType(type.value)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`2px solid ${accountType===type.value?type.color:"#e2e8f0"}`, borderRadius:12, cursor:"pointer", background:accountType===type.value?`${type.color}08`:"#fff", transition:"all 0.15s" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${accountType===type.value?type.color:"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {accountType===type.value && <div style={{ width:10, height:10, borderRadius:"50%", background:type.color }}/>}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{type.label}</div>
                    <div style={{ fontSize:12, color:"#64748b", fontFamily:ff }}>{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!accountType} style={{ width:"100%", background:accountType?"#2563eb":"#e2e8f0", color:accountType?"#fff":"#94a3b8", border:"none", borderRadius:12, padding:"12px", fontSize:15, fontWeight:700, cursor:accountType?"pointer":"default", fontFamily:ff, marginBottom:12 }}>
              Continue →
            </button>
            <div style={{ textAlign:"center", fontSize:13, color:"#64748b", fontFamily:ff }}>
              Have an account? <span onClick={()=>setMode("login")} style={{ color:"#2563eb", fontWeight:600, cursor:"pointer" }}>Sign In</span>
            </div>
          </>
        )}

        {/* REGISTER STEP 2 — Account Details */}
        {mode==="register" && step===2 && (
          <>
            {/* Account type pill */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <button onClick={() => setStep(1)} style={{ border:"none", background:"#f1f5f9", borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:12, color:"#64748b", fontFamily:ff }}>← Back</button>
              <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:`${ACCOUNT_TYPES.find(t=>t.value===accountType)?.color}15`, color:ACCOUNT_TYPES.find(t=>t.value===accountType)?.color, fontFamily:ff }}>
                {ACCOUNT_TYPES.find(t=>t.value===accountType)?.label}
              </span>
            </div>

            {/* Common fields */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith" style={inputStyle}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@email.com" style={inputStyle}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Password</label>
              <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={inputStyle}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Search City</label>
              <select value={city} onChange={e=>setCity(e.target.value)} style={{...inputStyle, background:"#fff"}}>
                {CITIES.filter(c=>c!=="All Cities").map(c=><option key={c}>{c}</option>)}
              </select>
            </div>

            {/* AGENT-specific fields */}
            {accountType==="agent" && (
              <>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>
                    License Number <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <input value={licenseNum} onChange={e=>setLicenseNum(e.target.value)} placeholder="e.g. NY-1234567" style={{...inputStyle, borderColor: licenseNum.trim() ? "#e2e8f0" : "#fca5a5"}}/>
                  {!licenseNum.trim() && <p style={{ fontSize:11, color:"#dc2626", marginTop:4, fontFamily:ff }}>Required to create an agent account</p>}
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Brokerage Name</label>
                  <input value={agentBrokerage} onChange={e=>setAgentBrokerage(e.target.value)} placeholder="e.g. Keller Williams NYC" style={inputStyle}/>
                </div>

                {/* Photo upload */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4, fontFamily:ff }}>
                    Profile Photo <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10, fontFamily:ff }}>A clear headshot builds trust with buyers. Required for agent accounts.</p>
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }}/>
                  {photoPreview ? (
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:"#f0fdf4", border:"2px solid #16a34a", borderRadius:12 }}>
                      <img src={photoPreview} alt="Preview" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", border:"2px solid #16a34a" }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#15803d", fontFamily:ff }}>✓ Photo uploaded</div>
                        <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{profilePhoto?.name}</div>
                      </div>
                      <button onClick={() => { setProfilePhoto(null); setPhotoPreview(null); }} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:"#94a3b8", fontFamily:ff }}>✕</button>
                    </div>
                  ) : (
                    <div onClick={() => photoRef.current?.click()} style={{ border:"2px dashed #fca5a5", borderRadius:12, padding:"20px", textAlign:"center", cursor:"pointer", background:"#fff5f5", transition:"all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="#fca5a5"}>
                      <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#64748b", fontFamily:ff }}>Click to upload your photo</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>JPG, PNG or HEIC · Max 5MB</div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:10, fontFamily:ff }}>Select Your Plan</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {AGENT_TIERS.map(tier => (
                      <label key={tier.value} onClick={() => setAgentTier(tier.value)} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", border:`2px solid ${agentTier===tier.value?"#16a34a":"#e2e8f0"}`, borderRadius:12, cursor:"pointer", background:agentTier===tier.value?"#f0fdf4":"#fff", transition:"all 0.15s", position:"relative" }}>
                        {tier.popular && <span style={{ position:"absolute", top:-1, right:12, fontSize:10, fontWeight:700, padding:"2px 8px", background:"#16a34a", color:"#fff", borderRadius:"0 0 6px 6px", fontFamily:ff }}>Most popular</span>}
                        <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${agentTier===tier.value?"#16a34a":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                          {agentTier===tier.value && <div style={{ width:9, height:9, borderRadius:"50%", background:"#16a34a" }}/>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{tier.label}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:"#16a34a", fontFamily:ff }}>{tier.price}</span>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                            {tier.features.map(f => (
                              <span key={f} style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>✓ {f}</span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* BROKER-specific fields */}
            {accountType==="broker" && (
              <>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Company / Lender Name</label>
                  <input value={brokerCompany} onChange={e=>setBrokerCompany(e.target.value)} placeholder="e.g. Chase Home Lending" style={inputStyle}/>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>
                    NMLS License Number <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <input value={brokerLicense} onChange={e=>setBrokerLicense(e.target.value)} placeholder="e.g. NMLS-1234567" style={{...inputStyle, borderColor: brokerLicense.trim() ? "#e2e8f0" : "#fca5a5"}}/>
                  {!brokerLicense.trim() && <p style={{ fontSize:11, color:"#dc2626", marginTop:4, fontFamily:ff }}>Required to create a broker account</p>}
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Business Phone</label>
                  <input value={brokerPhone} onChange={e=>setBrokerPhone(e.target.value)} placeholder="(212) 555-0100" style={inputStyle}/>
                </div>

                {/* Photo upload */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4, fontFamily:ff }}>
                    Profile Photo <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10, fontFamily:ff }}>Buyers want to know who they're working with. A professional headshot is required.</p>
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }}/>
                  {photoPreview ? (
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:"#f5f3ff", border:"2px solid #7c3aed", borderRadius:12 }}>
                      <img src={photoPreview} alt="Preview" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", border:"2px solid #7c3aed" }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#6d28d9", fontFamily:ff }}>✓ Photo uploaded</div>
                        <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{profilePhoto?.name}</div>
                      </div>
                      <button onClick={() => { setProfilePhoto(null); setPhotoPreview(null); }} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:"#94a3b8", fontFamily:ff }}>✕</button>
                    </div>
                  ) : (
                    <div onClick={() => photoRef.current?.click()} style={{ border:"2px dashed #fca5a5", borderRadius:12, padding:"20px", textAlign:"center", cursor:"pointer", background:"#fff5f5", transition:"all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="#fca5a5"}>
                      <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#64748b", fontFamily:ff }}>Click to upload your photo</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>JPG, PNG or HEIC · Max 5MB</div>
                    </div>
                  )}
                </div>

                {/* Tier selection */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:10, fontFamily:ff }}>Select Your Plan</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {BROKER_TIERS.map(tier => (
                      <label key={tier.value} onClick={() => setBrokerTier(tier.value)} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", border:`2px solid ${brokerTier===tier.value?"#7c3aed":"#e2e8f0"}`, borderRadius:12, cursor:"pointer", background:brokerTier===tier.value?"#f5f3ff":"#fff", transition:"all 0.15s", position:"relative" }}>
                        {tier.popular && <span style={{ position:"absolute", top:-1, right:12, fontSize:10, fontWeight:700, padding:"2px 8px", background:"#7c3aed", color:"#fff", borderRadius:"0 0 6px 6px", fontFamily:ff }}>Most popular</span>}
                        <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${brokerTier===tier.value?"#7c3aed":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                          {brokerTier===tier.value && <div style={{ width:9, height:9, borderRadius:"50%", background:"#7c3aed" }}/>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{tier.label}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:"#7c3aed", fontFamily:ff }}>{tier.price}</span>
                          </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                            {tier.features.map(f => (
                              <span key={f} style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>✓ {f}</span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* LANDLORD-specific fields — free account */}
            {accountType==="landlord" && (
              <>
                {/* Free account banner */}
                <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1.5px solid #bbf7d0", borderRadius:12, padding:"14px 16px", marginBottom:18 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#15803d", fontFamily:serif, marginBottom:4 }}>🎉 Individual Landlord accounts are free — always.</div>
                  <p style={{ fontSize:12, color:"#16a34a", fontFamily:ff, lineHeight:1.6 }}>We believe good landlords have nothing to hide. Verify your property and respond officially to comments at no cost.</p>
                  <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:4 }}>
                    {LANDLORD_FREE_FEATURES.map(f => (
                      <span key={f} style={{ fontSize:12, color:"#15803d", fontFamily:ff }}>✓ {f}</span>
                    ))}
                  </div>
                </div>

                {/* Verification doc */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4, fontFamily:ff }}>
                    Verify Property Ownership <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10, fontFamily:ff }}>
                    Upload one document to confirm you own the property you'll claim. Kept private — only used for verification.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                    {[
                      { v:"deed",     l:"📜 Property deed or title document" },
                      { v:"contract", l:"📋 Property tax bill with your name" },
                      { v:"license",  l:"🏢 Mortgage statement showing ownership" },
                    ].map(({v,l}) => (
                      <label key={v} onClick={() => setMgmtVerifyType(v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", border:`2px solid ${mgmtVerifyType===v?"#ea580c":"#e2e8f0"}`, borderRadius:10, cursor:"pointer", background:mgmtVerifyType===v?"#fff7ed":"#fff", transition:"all 0.15s" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${mgmtVerifyType===v?"#ea580c":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {mgmtVerifyType===v && <div style={{ width:8, height:8, borderRadius:"50%", background:"#ea580c" }}/>}
                        </div>
                        <span style={{ fontSize:13, color:"#1a202c", fontFamily:ff }}>{l}</span>
                      </label>
                    ))}
                  </div>
                  <input ref={mgmtDocRef} type="file" accept="image/*,.pdf" onChange={e=>setMgmtVerifyDoc(e.target.files?.[0]||null)} style={{ display:"none" }}/>
                  {mgmtVerifyDoc ? (
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:"#fff7ed", border:"2px solid #ea580c", borderRadius:12 }}>
                      <span style={{ fontSize:20 }}>📄</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#c2410c", fontFamily:ff }}>✓ Document uploaded</div>
                        <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{mgmtVerifyDoc.name}</div>
                      </div>
                      <button onClick={() => setMgmtVerifyDoc(null)} style={{ border:"none", background:"none", cursor:"pointer", color:"#94a3b8", fontSize:12, fontFamily:ff }}>✕</button>
                    </div>
                  ) : (
                    <div onClick={() => mgmtDocRef.current?.click()} style={{ border:"2px dashed #fed7aa", borderRadius:12, padding:"18px", textAlign:"center", cursor:"pointer", background:"#fff7ed", transition:"all 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#ea580c"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="#fed7aa"}>
                      <div style={{ fontSize:24, marginBottom:4 }}>📎</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#ea580c", fontFamily:ff }}>Upload ownership document</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>PDF, JPG or PNG · Max 10MB</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* MANAGEMENT-specific fields */}
            {accountType==="management" && (
              <>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>
                    Company / Business Name <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <input value={mgmtCompany} onChange={e=>setMgmtCompany(e.target.value)} placeholder="e.g. Park Property Group" style={{...inputStyle, borderColor: mgmtCompany.trim() ? "#e2e8f0" : "#fca5a5"}}/>
                  {!mgmtCompany.trim() && <p style={{ fontSize:11, color:"#dc2626", marginTop:4, fontFamily:ff }}>Required to create a management account</p>}
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Business Phone</label>
                  <input value={mgmtPhone} onChange={e=>setMgmtPhone(e.target.value)} placeholder="(212) 555-0100" style={inputStyle}/>
                </div>

                {/* Ownership / Management verification */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4, fontFamily:ff }}>
                    Verify Ownership or Management Authority <span style={{ color:"#dc2626" }}>*</span>
                  </label>
                  <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10, fontFamily:ff }}>
                    Upload one document to confirm your authority over the properties you'll claim. Kept private and only used for verification purposes.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                    {[
                      { v:"deed",     l:"📜 Property deed or title document" },
                      { v:"contract", l:"📋 Property management contract" },
                      { v:"license",  l:"🏢 Business license + property address match" },
                    ].map(({v,l}) => (
                      <label key={v} onClick={() => setMgmtVerifyType(v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", border:`2px solid ${mgmtVerifyType===v?"#ea580c":"#e2e8f0"}`, borderRadius:10, cursor:"pointer", background:mgmtVerifyType===v?"#fff7ed":"#fff", transition:"all 0.15s" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${mgmtVerifyType===v?"#ea580c":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {mgmtVerifyType===v && <div style={{ width:8, height:8, borderRadius:"50%", background:"#ea580c" }}/>}
                        </div>
                        <span style={{ fontSize:13, color:"#1a202c", fontFamily:ff }}>{l}</span>
                      </label>
                    ))}
                  </div>
                  <input ref={mgmtDocRef} type="file" accept="image/*,.pdf" onChange={e=>setMgmtVerifyDoc(e.target.files?.[0]||null)} style={{ display:"none" }}/>
                  {mgmtVerifyDoc ? (
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:"#fff7ed", border:"2px solid #ea580c", borderRadius:12 }}>
                      <span style={{ fontSize:20 }}>📄</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#c2410c", fontFamily:ff }}>✓ Document uploaded</div>
                        <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{mgmtVerifyDoc.name}</div>
                      </div>
                      <button onClick={() => setMgmtVerifyDoc(null)} style={{ border:"none", background:"none", cursor:"pointer", color:"#94a3b8", fontSize:12, fontFamily:ff }}>✕</button>
                    </div>
                  ) : (
                    <div onClick={() => mgmtDocRef.current?.click()} style={{ border:"2px dashed #fed7aa", borderRadius:12, padding:"18px", textAlign:"center", cursor:"pointer", background:"#fff7ed", transition:"all 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#ea580c"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="#fed7aa"}>
                      <div style={{ fontSize:24, marginBottom:4 }}>📎</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#ea580c", fontFamily:ff }}>Upload verification document</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>PDF, JPG or PNG · Max 10MB</div>
                    </div>
                  )}
                </div>

                {/* Tier selection */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:10, fontFamily:ff }}>Select Your Plan</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {MANAGEMENT_TIERS.map(tier => (
                      <label key={tier.value} onClick={() => setMgmtTier(tier.value)} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", border:`2px solid ${mgmtTier===tier.value?"#ea580c":"#e2e8f0"}`, borderRadius:12, cursor:"pointer", background:mgmtTier===tier.value?"#fff7ed":"#fff", transition:"all 0.15s", position:"relative" }}>
                        {tier.popular && <span style={{ position:"absolute", top:-1, right:12, fontSize:10, fontWeight:700, padding:"2px 8px", background:"#ea580c", color:"#fff", borderRadius:"0 0 6px 6px", fontFamily:ff }}>Most popular</span>}
                        <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${mgmtTier===tier.value?"#ea580c":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                          {mgmtTier===tier.value && <div style={{ width:9, height:9, borderRadius:"50%", background:"#ea580c" }}/>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{tier.label}</span>
                            <span style={{ fontSize:13, fontWeight:700, color:"#ea580c", fontFamily:ff }}>{tier.price}</span>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                            {tier.features.map(f => (
                              <span key={f} style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>✓ {f}</span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* BUYER fields — broker status + agent lookup */}
            {accountType==="buyer" && (
              <>
                {/* Agent status */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Do you have a real estate agent?</label>
                  <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10, fontFamily:ff }}>If yes, you can link them to your profile instantly — no invitation needed.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom: hasAgent==="yes" ? 12 : 0 }}>
                    {[{v:"yes",l:"Yes, I have an agent"},{v:"no",l:"No, I'm working alone"},{v:"looking",l:"I'm looking for one"}].map(({v,l}) => (
                      <label key={v} onClick={() => { setHasAgent(v); setLinkedAgent(null); setAgentSearch(""); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:`2px solid ${hasAgent===v?"#16a34a":"#e2e8f0"}`, borderRadius:10, cursor:"pointer", background:hasAgent===v?"#f0fdf4":"#fff", transition:"all 0.15s" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${hasAgent===v?"#16a34a":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {hasAgent===v && <div style={{ width:8, height:8, borderRadius:"50%", background:"#16a34a" }}/>}
                        </div>
                        <span style={{ fontSize:13, color:"#1a202c", fontFamily:ff }}>{l}</span>
                      </label>
                    ))}
                  </div>
                  {/* Agent lookup — shown when user says yes */}
                  {hasAgent==="yes" && (
                    <div style={{ marginTop:12, padding:"14px", background:"#f8fafc", borderRadius:12, border:"1px solid #e8eaed" }}>
                      <p style={{ fontSize:12, fontWeight:600, color:"#475569", marginBottom:10, fontFamily:ff }}>Find your agent by name, license #, or brokerage</p>
                      {linkedAgent ? (
                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#fff", borderRadius:10, border:"2px solid #16a34a" }}>
                          <Av letter={linkedAgent.av} size={32}/>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{linkedAgent.name}</div>
                            <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{linkedAgent.brokerage} · {linkedAgent.license}</div>
                          </div>
                          <span style={{ fontSize:11, color:"#16a34a", fontWeight:700, fontFamily:ff }}>✓ Linked</span>
                          <button onClick={() => { setLinkedAgent(null); setAgentSearch(""); }} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:"#94a3b8", fontFamily:ff }}>✕</button>
                        </div>
                      ) : (
                        <>
                          <input
                            value={agentSearch}
                            onChange={e => setAgentSearch(e.target.value)}
                            placeholder="e.g. Sandra Lee or NY-1042873"
                            style={{...inputStyle, marginBottom: agentResults.length > 0 ? 8 : 0}}
                          />
                          {agentResults.length > 0 && (
                            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                              {agentResults.map(agent => (
                                <div key={agent.id} onClick={() => { setLinkedAgent(agent); setAgentSearch(""); }}
                                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#fff", borderRadius:10, border:"1px solid #e8eaed", cursor:"pointer", transition:"border-color 0.15s" }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor="#16a34a"}
                                  onMouseLeave={e => e.currentTarget.style.borderColor="#e8eaed"}>
                                  <Av letter={agent.av} size={30}/>
                                  <div style={{ flex:1 }}>
                                    <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{agent.name}</div>
                                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{agent.brokerage} · {agent.license}</div>
                                  </div>
                                  <div style={{ textAlign:"right" }}>
                                    <div style={{ fontSize:11, color:"#f59e0b", fontFamily:ff }}>★ {agent.rating}</div>
                                    <div style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{agent.reviews} reviews</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {agentSearch.length > 1 && agentResults.length === 0 && (
                            <p style={{ fontSize:12, color:"#94a3b8", marginTop:6, fontFamily:ff }}>No agents found. You can link them later from your profile.</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Broker status */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Do you have a mortgage broker?</label>
                  <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10, fontFamily:ff }}>Only visible to verified agents and brokers on Chathouse.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[{v:"yes",l:"Yes, I have a broker"},{v:"no",l:"No, I'm looking for one"},{v:"unsure",l:"Not sure yet"}].map(({v,l}) => (
                      <label key={v} onClick={() => setHasBroker(v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:`2px solid ${hasBroker===v?"#2563eb":"#e2e8f0"}`, borderRadius:10, cursor:"pointer", background:hasBroker===v?"#eff6ff":"#fff", transition:"all 0.15s" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${hasBroker===v?"#2563eb":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {hasBroker===v && <div style={{ width:8, height:8, borderRadius:"50%", background:"#2563eb" }}/>}
                        </div>
                        <span style={{ fontSize:13, color:"#1a202c", fontFamily:ff }}>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Avatar */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:8, fontFamily:ff }}>Choose Avatar</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {letters.map(l => (
                  <div key={l} onClick={() => setAv(l)} style={{ cursor:"pointer", outline:av===l?"3px solid #2563eb":"3px solid transparent", outlineOffset:2, borderRadius:"50%", transition:"outline 0.15s" }}>
                    <Av letter={l} size={34}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation summary for pro accounts */}
            {(accountType==="agent" || accountType==="broker" || accountType==="management" || accountType==="landlord") && (
              <div style={{ marginBottom:12, padding:"10px 14px", background:"#f8fafc", borderRadius:10, border:"1px solid #e8eaed" }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:6, fontFamily:ff }}>Required to continue:</p>
                {accountType==="agent" && (
                  <>
                    <p style={{ fontSize:11, color: licenseNum.trim() ? "#16a34a" : "#dc2626", fontFamily:ff }}>{licenseNum.trim() ? "✓" : "○"} License number</p>
                    <p style={{ fontSize:11, color: profilePhoto ? "#16a34a" : "#dc2626", fontFamily:ff }}>{profilePhoto ? "✓" : "○"} Profile photo</p>
                  </>
                )}
                {accountType==="broker" && (
                  <>
                    <p style={{ fontSize:11, color: brokerLicense.trim() ? "#16a34a" : "#dc2626", fontFamily:ff }}>{brokerLicense.trim() ? "✓" : "○"} NMLS license number</p>
                    <p style={{ fontSize:11, color: profilePhoto ? "#16a34a" : "#dc2626", fontFamily:ff }}>{profilePhoto ? "✓" : "○"} Profile photo</p>
                  </>
                )}
                {accountType==="management" && (
                  <>
                    <p style={{ fontSize:11, color: mgmtCompany.trim() ? "#16a34a" : "#dc2626", fontFamily:ff }}>{mgmtCompany.trim() ? "✓" : "○"} Company name</p>
                    <p style={{ fontSize:11, color: mgmtVerifyDoc ? "#16a34a" : "#dc2626", fontFamily:ff }}>{mgmtVerifyDoc ? "✓" : "○"} Verification document</p>
                  </>
                )}
                {accountType==="landlord" && (
                  <p style={{ fontSize:11, color: mgmtVerifyDoc ? "#16a34a" : "#dc2626", fontFamily:ff }}>{mgmtVerifyDoc ? "✓" : "○"} Ownership verification document</p>
                )}
              </div>
            )}

            {(() => {
              const proBlocked = (accountType==="agent" && (!licenseNum.trim() || !profilePhoto)) ||
                                 (accountType==="broker" && (!brokerLicense.trim() || !profilePhoto)) ||
                                 (accountType==="management" && (!mgmtCompany.trim() || !mgmtVerifyDoc)) ||
                                 (accountType==="landlord" && !mgmtVerifyDoc);
              return (
                <button onClick={submit} disabled={proBlocked} style={{ width:"100%", background:proBlocked?"#e2e8f0":"#2563eb", color:proBlocked?"#94a3b8":"#fff", border:"none", borderRadius:12, padding:"12px", fontSize:15, fontWeight:700, cursor:proBlocked?"not-allowed":"pointer", fontFamily:ff, marginBottom:12, transition:"all 0.2s" }}>
                  Create Account →
                </button>
              );
            })()}
            <div style={{ textAlign:"center", fontSize:13, color:"#64748b", fontFamily:ff }}>
              Have an account? <span onClick={()=>setMode("login")} style={{ color:"#2563eb", fontWeight:600, cursor:"pointer" }}>Sign In</span>
            </div>
          </>
        )}

        {/* LOGIN FLOW */}
        {mode==="login" && (
          <>
            {/* Demo quick-access */}
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textAlign:"center", marginBottom:10, textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff }}>Try a demo account</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { type:"agent",      icon:"🤝", label:"Demo as Agent",                   sub:"Sandra Lee · Compass NYC · Pro plan",           color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
                  { type:"broker",     icon:"🏦", label:"Demo as Broker",                  sub:"Robert Chen · Chase Home Lending · Pro plan",   color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
                  { type:"buyer",      icon:"🏘️", label:"Demo as Resident / Buyer / Renter", sub:"Marcus T. · Linked agent & searching NYC",      color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
                  { type:"landlord",   icon:"🏡", label:"Demo as Individual Landlord",      sub:"James R. · 1 property · Free account",          color:"#ea580c", bg:"#fff7ed", border:"#fed7aa" },
                  { type:"management", icon:"🏢", label:"Demo as Property Manager",         sub:"David Park · Park Property Group · 3 listings", color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
                ].map(({type,icon,label,sub,color,bg,border}) => (
                  <button key={type} onClick={() => onAuth(DEMO_ACCOUNTS[type])}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:bg, border:`1.5px solid ${border}`, borderRadius:12, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.transform="translateX(3px)"}
                    onMouseLeave={e => e.currentTarget.style.transform="translateX(0)"}>
                    <span style={{ fontSize:20 }}>{icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color, fontFamily:ff }}>{label}</div>
                      <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{sub}</div>
                    </div>
                    <span style={{ fontSize:13, color, fontFamily:ff }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ flex:1, height:1, background:"#e8eaed" }}/>
              <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>or sign in with email</span>
              <div style={{ flex:1, height:1, background:"#e8eaed" }}/>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@email.com" style={inputStyle}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, fontFamily:ff }}>Password</label>
              <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={inputStyle}/>
            </div>
            <button onClick={submit} style={{ width:"100%", background:"#2563eb", color:"#fff", border:"none", borderRadius:12, padding:"12px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:ff, marginBottom:12 }}>
              Sign In →
            </button>
            <div style={{ textAlign:"center", fontSize:13, color:"#64748b", fontFamily:ff }}>
              No account? <span onClick={()=>setMode("register")} style={{ color:"#2563eb", fontWeight:600, cursor:"pointer" }}>Sign Up</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ n, onDismiss }) {
  useEffect(() => { const t=setTimeout(onDismiss,4500); return ()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed", top:74, right:20, zIndex:3000, background:"#fff", border:"1.5px solid #e8eaed", borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,0.14)", padding:"14px 18px", maxWidth:320, display:"flex", gap:12, alignItems:"flex-start", animation:"slideRight 0.3s ease" }}>
      <span style={{ fontSize:22 }}>{n.icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", marginBottom:3, fontFamily:ff }}>{n.title}</div>
        <div style={{ fontSize:12, color:"#64748b", lineHeight:1.4, fontFamily:ff }}>{n.body}</div>
      </div>
      <button onClick={onDismiss} style={{ border:"none", background:"none", cursor:"pointer", color:"#94a3b8", fontSize:15 }}>✕</button>
    </div>
  );
}

// ─── NOTIF PANEL ──────────────────────────────────────────────────────────────
function NotifPanel({ notifs, onClear }) {
  return (
    <div style={{ position:"absolute", top:50, right:0, width:330, background:"#fff", border:"1.5px solid #e8eaed", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,0.13)", zIndex:500, overflow:"hidden" }}>
      <div style={{ padding:"13px 18px 9px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontWeight:700, fontSize:14, color:"#1a202c", fontFamily:ff }}>Notifications</span>
        <button onClick={onClear} style={{ border:"none", background:"none", fontSize:12, color:"#2563eb", fontWeight:600, cursor:"pointer", fontFamily:ff }}>Mark all read</button>
      </div>
      <div style={{ maxHeight:320, overflowY:"auto" }}>
        {notifs.length===0
          ? <div style={{ padding:"32px", textAlign:"center", color:"#94a3b8", fontSize:13, fontFamily:ff }}>All caught up!</div>
          : notifs.map(n => (
            <div key={n.id} style={{ padding:"11px 18px", borderBottom:"1px solid #f8fafc", display:"flex", gap:10, background:n.read?"#fff":"#f8fafc" }}>
              <span style={{ fontSize:17 }}>{n.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#1e293b", fontFamily:ff }}>{n.title}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:1, fontFamily:ff }}>{n.body}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:3, fontFamily:ff }}>{n.time}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── PROFILE DROPDOWN ─────────────────────────────────────────────────────────
function ProfileMenu({ user, savedCount, onLogout }) {
  const [showAgent, setShowAgent] = useState(false);
  const [showBroker, setShowBroker] = useState(false);
  const acctType = ACCOUNT_TYPES.find(t => t.value === user.accountType);
  const isBuyer = user.accountType === "buyer" || (!user.accountType);
  const hasLinkedAgent = isBuyer && user.linkedAgent;
  const hasLinkedBroker = isBuyer && user.hasBroker === "yes";

  return (
    <div style={{ position:"absolute", top:50, right:0, width:272, background:"#fff", border:"1.5px solid #e8eaed", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,0.12)", zIndex:500, overflow:"hidden" }}>

      {/* Header */}
      <div style={{ padding:"18px 18px 12px", borderBottom:"1px solid #f1f5f9", textAlign:"center" }}>
        {user.photoPreview
          ? <img src={user.photoPreview} alt="" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", border:"3px solid #e8eaed", margin:"0 auto", display:"block" }}/>
          : <Av letter={user.av} size={56}/>
        }
        <div style={{ fontSize:15, fontWeight:700, color:"#1a202c", marginTop:9, fontFamily:ff }}>{user.name}</div>
        <div style={{ fontSize:12, color:"#64748b", marginTop:2, fontFamily:ff }}>{user.email}</div>
        {acctType && (
          <div style={{ display:"inline-block", marginTop:6, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:`${acctType.color}15`, color:acctType.color, fontFamily:ff }}>
            {acctType.label}
          </div>
        )}
        {user.accountType==="broker" && user.brokerTier && (
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:4, fontFamily:ff }}>
            {BROKER_TIERS.find(t=>t.value===user.brokerTier)?.label} plan · {BROKER_TIERS.find(t=>t.value===user.brokerTier)?.price}
          </div>
        )}
        {user.accountType==="agent" && user.agentTier && (
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:4, fontFamily:ff }}>
            {AGENT_TIERS.find(t=>t.value===user.agentTier)?.label} plan · {AGENT_TIERS.find(t=>t.value===user.agentTier)?.price}
          </div>
        )}
        {user.accountType==="agent" && user.agentBrokerage && (
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:4, fontFamily:ff }}>🏢 {user.agentBrokerage}</div>
        )}
        {user.accountType==="management" && (
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:4, fontFamily:ff }}>
            {user.managementCompany || "Park Property Group"} · {MANAGEMENT_TIERS.find(t=>t.value===(user.managementTier||"pro"))?.label} plan · {MANAGEMENT_TIERS.find(t=>t.value===(user.managementTier||"pro"))?.price}
          </div>
        )}
        {user.accountType==="landlord" && (
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:4, fontFamily:ff }}>Individual Landlord · 🎉 Free Account</div>
        )}
        <div style={{ fontSize:11, color:"#94a3b8", marginTop:3, fontFamily:ff }}>📍 {user.city}</div>
      </div>

      {/* Stats */}
      <div style={{ padding:"8px 18px", borderBottom: (hasLinkedAgent || hasLinkedBroker) ? "1px solid #f1f5f9" : "none" }}>
        {[{icon:"🔖",label:"Saved",val:savedCount},{icon:"💬",label:"Comments",val:3},{icon:"♥",label:"Likes Given",val:12}].map(({icon,label,val}) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f8fafc" }}>
            <span style={{ fontSize:13, color:"#475569", fontFamily:ff }}>{icon} {label}</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Linked agent — buyer only */}
      {hasLinkedAgent && (
        <div style={{ borderBottom:"1px solid #f1f5f9" }}>
          <button onClick={() => setShowAgent(o => !o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 18px", border:"none", background:"none", cursor:"pointer", textAlign:"left" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#16a34a", fontFamily:ff }}>🤝 My Agent</span>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#f0fdf4", color:"#15803d", fontFamily:ff }}>✓ Linked</span>
            </div>
            <span style={{ fontSize:11, color:"#94a3b8" }}>{showAgent ? "▲" : "▼"}</span>
          </button>
          {showAgent && (
            <div style={{ padding:"0 18px 14px", animation:"fadeUp 0.2s ease" }}>
              <div style={{ background:"#f8fafc", borderRadius:10, border:"1px solid #e8eaed", padding:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <Av letter={user.linkedAgent.av} size={36}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{user.linkedAgent.name}</div>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{user.linkedAgent.brokerage}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>License</span>
                    <span style={{ fontSize:11, fontWeight:600, color:"#334155", fontFamily:ff }}>{user.linkedAgent.license}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>Status</span>
                    <span style={{ fontSize:11, fontWeight:600, color:"#16a34a", fontFamily:ff }}>✓ Verified agent</span>
                  </div>
                </div>
                <button style={{ marginTop:10, width:"100%", background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:8, padding:"7px", fontSize:12, fontWeight:600, color:"#16a34a", cursor:"pointer", fontFamily:ff }}>
                  📩 Message agent
                </button>
                <button onClick={e => { e.stopPropagation(); if(window.confirm("Unlink Sandra Lee as your agent?")) {} }} style={{ marginTop:6, width:"100%", background:"#fff", border:"1.5px solid #fee2e2", borderRadius:8, padding:"7px", fontSize:12, fontWeight:600, color:"#dc2626", cursor:"pointer", fontFamily:ff }}>
                  🔗 Unlink agent
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Linked broker — buyer only, shown if hasBroker = yes */}
      {hasLinkedBroker && (
        <div style={{ borderBottom:"1px solid #f1f5f9" }}>
          <button onClick={() => setShowBroker(o => !o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 18px", border:"none", background:"none", cursor:"pointer", textAlign:"left" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#2563eb", fontFamily:ff }}>🏦 My Broker</span>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#eff6ff", color:"#1d4ed8", fontFamily:ff }}>✓ Linked</span>
            </div>
            <span style={{ fontSize:11, color:"#94a3b8" }}>{showBroker ? "▲" : "▼"}</span>
          </button>
          {showBroker && (
            <div style={{ padding:"0 18px 14px", animation:"fadeUp 0.2s ease" }}>
              <div style={{ background:"#f8fafc", borderRadius:10, border:"1px solid #e8eaed", padding:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🏦</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{user.linkedBroker?.name || "Your Mortgage Broker"}</div>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{user.linkedBroker?.company || "Linked during signup"}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
                  {user.linkedBroker?.license && (
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>License</span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#334155", fontFamily:ff }}>{user.linkedBroker.license}</span>
                    </div>
                  )}
                  {user.linkedBroker?.phone && (
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>Phone</span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#2563eb", cursor:"pointer", fontFamily:ff }}>{user.linkedBroker.phone} ↗</span>
                    </div>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>Status</span>
                    <span style={{ fontSize:11, fontWeight:600, color:"#1d4ed8", fontFamily:ff }}>✓ Verified broker</span>
                  </div>
                </div>
                <button style={{ width:"100%", background:"#eff6ff", border:"1.5px solid #bfdbfe", borderRadius:8, padding:"7px", fontSize:12, fontWeight:600, color:"#2563eb", cursor:"pointer", fontFamily:ff }}>
                  📩 Message broker
                </button>
                <button onClick={e => { e.stopPropagation(); if(window.confirm("Unlink your mortgage broker?")) {} }} style={{ marginTop:6, width:"100%", background:"#fff", border:"1.5px solid #fee2e2", borderRadius:8, padding:"7px", fontSize:12, fontWeight:600, color:"#dc2626", cursor:"pointer", fontFamily:ff }}>
                  🔗 Unlink broker
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No agent prompt — buyer only */}
      {isBuyer && !hasLinkedAgent && (
        <div style={{ padding:"10px 18px", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"#94a3b8", fontFamily:ff }}>🤝 No agent linked yet</span>
            <span style={{ fontSize:11, color:"#2563eb", fontWeight:600, cursor:"pointer", fontFamily:ff }}>Find one →</span>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div style={{ padding:"8px 18px 14px" }}>
        <button onClick={onLogout} style={{ width:"100%", border:"1.5px solid #fee2e2", background:"#fff", color:"#dc2626", borderRadius:10, padding:"8px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── AGENT DASHBOARD ──────────────────────────────────────────────────────────
function AgentDashboard({ user }) {
  const [activeClient, setActiveClient] = useState(null);
  const buyers = user.linkedBuyers || DEMO_ACCOUNTS.agent.linkedBuyers;
  const stats = user.stats || DEMO_ACCOUNTS.agent.stats;

  const StatCard = ({ icon, label, val, color }) => (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", flex:1 }}>
      <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginBottom:4 }}>{icon} {label}</div>
      <div style={{ fontSize:26, fontWeight:800, color:color||"#1a202c", fontFamily:serif }}>{val}</div>
    </div>
  );

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      {/* Welcome bar */}
      <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1.5px solid #bbf7d0", borderRadius:14, padding:"16px 20px", marginBottom:22, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:"50%", background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤝</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"#14532d", fontFamily:ff }}>Welcome back, {user.name.split(" ")[0]}</div>
          <div style={{ fontSize:12, color:"#16a34a", fontFamily:ff }}>{user.agentBrokerage || "Compass NYC"} · License {user.licenseNum || "NY-1042873"} · {(user.agentTier||"pro").charAt(0).toUpperCase()+(user.agentTier||"pro").slice(1)} plan</div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"#16a34a", color:"#fff", fontFamily:ff }}>✓ Verified Agent</div>
      </div>

      {/* MLS sync note */}
      <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", borderRadius:12, padding:"12px 16px", marginBottom:22, display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20, flexShrink:0 }}>🔄</span>
        <p style={{ fontSize:13, color:"#1e40af", fontFamily:ff, lineHeight:1.5 }}>
          <strong>Your MLS listings sync to Chathouse automatically</strong> — no manual posting needed. Once a listing is submitted to the MLS it will appear on the feed within 24–48 hours and your agent profile will be attached.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
        <StatCard icon="👥" label="Linked Buyers" val={stats.linkedBuyers} color="#16a34a"/>
        <StatCard icon="👁️" label="Profile Views" val={stats.profileViews}/>
        <StatCard icon="♥" label="Comment Likes" val={stats.commentLikes}/>
        <StatCard icon="🔍" label="Search Appearances" val={stats.searchAppearances}/>
      </div>

      {/* Client list */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:22 }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>👥 Your Linked Clients</span>
          <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{buyers.length} active</span>
        </div>
        <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:10 }}>
          {buyers.map(buyer => (
            <div key={buyer.id} onClick={() => setActiveClient(activeClient?.id===buyer.id ? null : buyer)}
              style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background: activeClient?.id===buyer.id ? "#f0fdf4" : "#f8fafc", borderRadius:12, border:`1.5px solid ${activeClient?.id===buyer.id?"#16a34a":"#f1f5f9"}`, cursor:"pointer", transition:"all 0.15s" }}>
              <Av letter={buyer.av} size={38}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{buyer.name}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#f0fdf4", color:"#15803d", fontFamily:ff }}>✓ Your client</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background: buyer.hasBroker?"#eff6ff":"#fffbeb", color:buyer.hasBroker?"#1d4ed8":"#d97706", fontFamily:ff }}>
                    {buyer.hasBroker ? "✓ Has broker" : "⚡ No broker"}
                  </span>
                </div>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:8 }}>
                  {[{l:"Location",v:buyer.location},{l:"Type",v:buyer.propertyType},{l:"Timeline",v:buyer.timeline},{l:"Pre-approval",v:buyer.preApproval}].map(({l,v}) => (
                    <span key={l} style={{ fontSize:11, color:"#64748b", fontFamily:ff }}><span style={{ color:"#94a3b8" }}>{l}:</span> {v}</span>
                  ))}
                </div>
                {buyer.hasBroker && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"#fff", borderRadius:8, border:"1px solid #e8eaed" }}>
                    <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>Broker:</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{buyer.brokerName}</span>
                    <span style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{buyer.brokerCompany}</span>
                    <span style={{ marginLeft:"auto", fontSize:11, color:"#2563eb", fontWeight:600, cursor:"pointer", fontFamily:ff }}>{buyer.brokerPhone} ↗</span>
                  </div>
                )}
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{buyer.lastActive}</div>
                <div style={{ fontSize:11, color:"#2563eb", fontFamily:ff }}>🔖 {buyer.savedListings} saved</div>
              </div>
            </div>
          ))}
          {activeClient && (
            <div style={{ padding:"14px 16px", background:"#fff", borderRadius:12, border:"1.5px solid #bbf7d0", marginTop:4, animation:"fadeUp 0.2s ease" }}>
              <p style={{ fontSize:12, fontWeight:700, color:"#475569", marginBottom:10, fontFamily:ff }}>Quick actions for {activeClient.name}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {!activeClient.hasLinkedAgent && <LinkRequestButton accountType="agent" buyerName={activeClient.name}/>}
                {[{l:"📩 Send message",c:"#2563eb",bg:"#eff6ff"},{l:"📋 View saved listings",c:"#7c3aed",bg:"#f5f3ff"},{l:"🏦 Connect to broker",c:"#d97706",bg:"#fffbeb",show:!activeClient.hasBroker}]
                  .filter(a => a.show !== false)
                  .map(({l,c,bg}) => (
                    <button key={l} style={{ fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:20, border:"none", background:bg, color:c, cursor:"pointer", fontFamily:ff }}>{l}</button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zip Code Advertising */}
      <ZipCodeAdvertising accountType="agent"/>

      {/* New buyer alerts */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>🔔 Recent Activity</span>
        </div>
        <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:8 }}>
          {[
            { icon:"🔗", text:"Aisha Lewis linked you as her agent", time:"30m ago", color:"#16a34a" },
            { icon:"🔖", text:"Jordan Mitchell saved 2 new listings", time:"2h ago", color:"#2563eb" },
            { icon:"💬", text:"You were mentioned in a comment on 310 W 85th St", time:"4h ago", color:"#7c3aed" },
            { icon:"👁️", text:"14 buyers viewed your profile this week", time:"Today", color:"#f59e0b" },
          ].map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom: i<3?"1px solid #f8fafc":"none" }}>
              <span style={{ fontSize:16 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:"#334155", fontFamily:ff }}>{a.text}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ZIP CODE ADVERTISING ─────────────────────────────────────────────────────
const NYC_ZIPS = [
  { zip:"10024", hood:"Upper West Side",  demand:"high",   agentPrice:249, brokerPrice:199, mgmtPrice:149 },
  { zip:"11211", hood:"Williamsburg",     demand:"high",   agentPrice:229, brokerPrice:179, mgmtPrice:129 },
  { zip:"10031", hood:"Harlem",           demand:"medium", agentPrice:149, brokerPrice:119, mgmtPrice:89  },
  { zip:"11201", hood:"Brooklyn Heights", demand:"high",   agentPrice:249, brokerPrice:199, mgmtPrice:149 },
  { zip:"10014", hood:"West Village",     demand:"high",   agentPrice:299, brokerPrice:249, mgmtPrice:179 },
  { zip:"11215", hood:"Park Slope",       demand:"high",   agentPrice:229, brokerPrice:179, mgmtPrice:129 },
  { zip:"10003", hood:"East Village",     demand:"medium", agentPrice:179, brokerPrice:149, mgmtPrice:99  },
  { zip:"11222", hood:"Greenpoint",       demand:"medium", agentPrice:149, brokerPrice:119, mgmtPrice:89  },
  { zip:"10036", hood:"Midtown West",     demand:"high",   agentPrice:299, brokerPrice:249, mgmtPrice:179 },
  { zip:"11216", hood:"Crown Heights",    demand:"low",    agentPrice:99,  brokerPrice:79,  mgmtPrice:59  },
  { zip:"10453", hood:"Bronx",            demand:"low",    agentPrice:79,  brokerPrice:59,  mgmtPrice:49  },
  { zip:"11372", hood:"Jackson Heights",  demand:"low",    agentPrice:79,  brokerPrice:59,  mgmtPrice:49  },
];

const DEMAND_COLORS = {
  high:   { bg:"#fef2f2", color:"#dc2626", border:"#fecaca", label:"🔥 High demand" },
  medium: { bg:"#fffbeb", color:"#d97706", border:"#fde68a", label:"⚡ Medium demand" },
  low:    { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0", label:"✓ Available" },
};

function ZipCodeAdvertising({ accountType }) {
  const [ownedZips, setOwnedZips] = useState(
    accountType==="agent"
      ? [{ zip:"10024", hood:"Upper West Side", price:249, since:"2 months ago", impressions:1842, clicks:67 }]
      : accountType==="broker"
      ? [{ zip:"11211", hood:"Williamsburg", price:179, since:"1 month ago", impressions:1204, clicks:43 }]
      : []
  );
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [purchasedZip, setPurchasedZip] = useState(null);

  const priceKey = accountType==="agent" ? "agentPrice" : accountType==="broker" ? "brokerPrice" : "mgmtPrice";
  const color = accountType==="agent" ? "#16a34a" : accountType==="broker" ? "#7c3aed" : "#ea580c";
  const bg    = accountType==="agent" ? "#f0fdf4"  : accountType==="broker" ? "#f5f3ff"  : "#fff7ed";

  const handlePurchase = (zipData) => {
    setPurchasedZip(zipData.zip);
    setTimeout(() => {
      setOwnedZips(p => [...p, { zip:zipData.zip, hood:zipData.hood, price:zipData[priceKey], since:"Just now", impressions:0, clicks:0 }]);
      setShowMarketplace(false);
      setPurchasedZip(null);
    }, 1500);
  };

  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:22 }}>
      <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>📍 Zip Code Advertising</span>
          <p style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:2 }}>Own a zip code and get featured placement when buyers browse listings in that area</p>
        </div>
        <button onClick={() => setShowMarketplace(o=>!o)} style={{ fontSize:12, fontWeight:700, padding:"7px 16px", background:color, color:"#fff", border:"none", borderRadius:20, cursor:"pointer", fontFamily:ff }}>
          {showMarketplace ? "✕ Close" : "+ Buy a Zip Code"}
        </button>
      </div>

      {/* Owned zips */}
      <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
        {ownedZips.length===0 && !showMarketplace && (
          <div style={{ textAlign:"center", padding:"24px", color:"#94a3b8", fontSize:13, fontFamily:ff }}>
            You don't own any zip codes yet. Buy one to get featured placement with buyers in that neighborhood.
          </div>
        )}
        {ownedZips.map(z => (
          <div key={z.zip} style={{ background:bg, borderRadius:12, border:`1.5px solid ${color}30`, padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0, fontFamily:ff }}>
                {z.zip.slice(-3)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{z.hood}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:color, color:"#fff", fontFamily:ff }}>📍 You own this</span>
                </div>
                <div style={{ fontSize:11, color:"#64748b", fontFamily:ff, marginTop:2 }}>ZIP {z.zip} · ${z.price}/mo · Active since {z.since}</div>
              </div>
              <button onClick={() => setOwnedZips(p => p.filter(x => x.zip!==z.zip))} style={{ border:"1.5px solid #fecaca", background:"#fff", color:"#dc2626", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                Cancel
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { label:"Impressions", val:z.impressions.toLocaleString(), icon:"👁️" },
                { label:"Profile Clicks", val:z.clicks.toLocaleString(), icon:"👆" },
                { label:"Click Rate", val: z.impressions > 0 ? `${((z.clicks/z.impressions)*100).toFixed(1)}%` : "—", icon:"📊" },
              ].map(({label,val,icon}) => (
                <div key={label} style={{ background:"#fff", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{icon} {label}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#1a202c", fontFamily:serif, marginTop:2 }}>{val}</div>
                </div>
              ))}
            </div>
            {/* Preview of what buyers see */}
            <div style={{ marginTop:10, background:"#fff", borderRadius:8, border:"1.5px dashed #e2e8f0", padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:6 }}>Preview — what buyers see in {z.hood}</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14, flexShrink:0 }}>
                  {accountType==="agent" ? "S" : accountType==="broker" ? "R" : "D"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>
                    {accountType==="agent" ? "Sandra Lee · Compass NYC" : accountType==="broker" ? "Robert Chen · Chase Home Lending" : "David Park · Park Property Group"}
                  </div>
                  <div style={{ fontSize:10, color:"#64748b", fontFamily:ff }}>
                    {accountType==="agent" ? "Looking for an agent in "+z.hood+"?" : accountType==="broker" ? "Need a mortgage broker in "+z.hood+"?" : "Property management in "+z.hood}
                  </div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:`${color}15`, color, fontFamily:ff }}>Featured</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zip code marketplace */}
      {showMarketplace && (
        <div style={{ borderTop:"1px solid #f1f5f9", padding:"16px 18px" }}>
          <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
            <p style={{ fontSize:12, color:"#92400e", fontFamily:ff }}>💡 <strong>How it works:</strong> Own a zip code and a "Featured" card with your profile appears to buyers browsing listings in that area. One {accountType} per zip code. Month-to-month, cancel anytime.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {NYC_ZIPS.filter(z => !ownedZips.find(o => o.zip===z.zip)).map(z => {
              const d = DEMAND_COLORS[z.demand];
              const price = z[priceKey];
              const isPurchasing = purchasedZip===z.zip;
              return (
                <div key={z.zip} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#f8fafc", borderRadius:12, border:"1px solid #f1f5f9" }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:"#fff", border:"1px solid #e8eaed", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <div style={{ fontSize:9, color:"#94a3b8", fontFamily:ff }}>ZIP</div>
                    <div style={{ fontSize:12, fontWeight:800, color:"#1a202c", fontFamily:ff }}>{z.zip.slice(-3)}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{z.hood}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:d.bg, color:d.color, border:`1px solid ${d.border}`, fontFamily:ff }}>{d.label}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>ZIP {z.zip} · New York, NY</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:"#1a202c", fontFamily:serif }}>${price}<span style={{ fontSize:11, fontWeight:400, color:"#94a3b8" }}>/mo</span></div>
                    <button onClick={() => handlePurchase(z)} disabled={isPurchasing} style={{ marginTop:4, background: isPurchasing?"#f0fdf4":color, color: isPurchasing?"#15803d":"#fff", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor: isPurchasing?"default":"pointer", fontFamily:ff, transition:"all 0.2s" }}>
                      {isPurchasing ? "✓ Purchased!" : "Buy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
function BrokerDashboard({ user }) {
  const [filter, setFilter] = useState("all");
  const [activeLeadId, setActiveLeadId] = useState(null);
  const leads = user.linkedLeads || DEMO_ACCOUNTS.broker.linkedLeads;
  const stats = user.stats || DEMO_ACCOUNTS.broker.stats;

  const filtered = leads.filter(l => {
    if (filter==="no_broker") return !l.hasBroker;
    if (filter==="has_broker") return l.hasBroker;
    return true;
  });

  const StatCard = ({ icon, label, val, color }) => (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", flex:1 }}>
      <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginBottom:4 }}>{icon} {label}</div>
      <div style={{ fontSize:26, fontWeight:800, color:color||"#1a202c", fontFamily:serif }}>{val}</div>
    </div>
  );

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      {/* Welcome bar */}
      <div style={{ background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", border:"1.5px solid #ddd6fe", borderRadius:14, padding:"16px 20px", marginBottom:22, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:"50%", background:"#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🏦</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"#3b0764", fontFamily:ff }}>Welcome back, {user.name.split(" ")[0]}</div>
          <div style={{ fontSize:12, color:"#7c3aed", fontFamily:ff }}>{user.brokerCompany || "Chase Home Lending"} · NMLS {user.brokerLicense || "NMLS-1847392"} · {(user.brokerTier||"pro").charAt(0).toUpperCase()+(user.brokerTier||"pro").slice(1)} plan</div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"#7c3aed", color:"#fff", fontFamily:ff }}>✓ Verified Broker</div>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
        <StatCard icon="👥" label="Active Leads" val={stats.activeLeads} color="#7c3aed"/>
        <StatCard icon="📩" label="Contacts Made" val={stats.contactsMade}/>
        <StatCard icon="👁️" label="Profile Views" val={stats.profileViews}/>
        <StatCard icon="⚡" label="No-Broker Alerts" val={stats.noBrokerAlerts} color="#d97706"/>
      </div>

      {/* Lead feed */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:22 }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>🏦 Buyer Lead Feed</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            {[{v:"all",l:"All"},{v:"no_broker",l:"No Broker"},{v:"has_broker",l:"Has Broker"}].map(({v,l}) => (
              <button key={v} onClick={() => setFilter(v)} style={{ border:`1.5px solid ${filter===v?"#7c3aed":"#e2e8f0"}`, background:filter===v?"#f5f3ff":"#fff", color:filter===v?"#7c3aed":"#64748b", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(lead => (
            <div key={lead.id}>
              <div onClick={() => setActiveLeadId(activeLeadId===lead.id ? null : lead.id)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background: activeLeadId===lead.id?"#f5f3ff":"#f8fafc", borderRadius:12, border:`1.5px solid ${activeLeadId===lead.id?"#7c3aed":"#f1f5f9"}`, cursor:"pointer", transition:"all 0.15s" }}>
                <Av letter={lead.av} size={38}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{lead.name}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:lead.hasBroker?"#f0fdf4":"#fffbeb", color:lead.hasBroker?"#15803d":"#d97706", fontFamily:ff }}>
                      {lead.hasBroker ? "✓ Has broker" : "⚡ No broker"}
                    </span>
                    {lead.hasAgent && <span style={{ fontSize:10, color:"#2563eb", fontFamily:ff }}>Agent: {lead.agentName}</span>}
                  </div>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    {[{l:"Location",v:lead.location},{l:"Type",v:lead.propertyType},{l:"Timeline",v:lead.timeline},{l:"Pre-approval",v:lead.preApproval}].map(({l,v}) => (
                      <span key={l} style={{ fontSize:11, color:"#64748b", fontFamily:ff }}><span style={{ color:"#94a3b8" }}>{l}:</span> {v}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{lead.lastActive}</div>
                  {!lead.hasBroker && (
                    <div style={{ fontSize:10, fontWeight:700, color:"#d97706", fontFamily:ff }}>🎯 Hot lead</div>
                  )}
                </div>
              </div>
              {activeLeadId===lead.id && (
                <div style={{ padding:"12px 16px", background:"#fff", borderRadius:"0 0 12px 12px", border:"1.5px solid #ddd6fe", borderTop:"none", animation:"fadeUp 0.2s ease" }}>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button style={{ fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:20, border:"none", background:"#f5f3ff", color:"#7c3aed", cursor:"pointer", fontFamily:ff }}>📩 Contact {lead.hasAgent ? "buyer or agent" : "buyer"}</button>
                    <button style={{ fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:20, border:"none", background:"#eff6ff", color:"#2563eb", cursor:"pointer", fontFamily:ff }}>📋 View profile</button>
                    {lead.hasAgent && <button style={{ fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:20, border:"none", background:"#f0fdf4", color:"#16a34a", cursor:"pointer", fontFamily:ff }}>🤝 Contact agent</button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>🔔 Recent Activity</span>
        </div>
        <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:8 }}>
          {[
            { icon:"⚡", text:"Jordan Mitchell has no broker — marked as hot lead", time:"2h ago", color:"#d97706" },
            { icon:"🔗", text:"Tyrese Walker linked your profile via license lookup", time:"4h ago", color:"#7c3aed" },
            { icon:"👁️", text:"9 buyers viewed your broker profile this week", time:"Today", color:"#2563eb" },
            { icon:"📩", text:"You contacted Camille Torres — awaiting response", time:"Yesterday", color:"#16a34a" },
          ].map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:i<3?"1px solid #f8fafc":"none" }}>
              <span style={{ fontSize:16 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:"#334155", fontFamily:ff }}>{a.text}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:2, fontFamily:ff }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zip Code Advertising */}
      <ZipCodeAdvertising accountType="broker"/>
    </div>
  );
}

// ─── CONVERSATION THREAD ──────────────────────────────────────────────────────
function ConversationThread({ convo, user, listings, onClose, onSend }) {
  const [txt, setTxt] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [msgReactions, setMsgReactions] = useState({});
  const [localMessages, setLocalMessages] = useState(convo.messages);
  const endRef = useRef();
  const EMOJIS = ["👍","❤️","😂","😮","🙏","🔥","💯","🏠"];

  const send = (sharedListing) => {
    if (!txt.trim() && !sharedListing) return;
    const newMsg = { id:Date.now(), from:"Me", av:user.av, text:txt.trim(), time:"Just now", mine:true, sharedListing };
    setLocalMessages(p => [...p, newMsg]);
    onSend(txt.trim(), sharedListing);
    setTxt(""); setShowListings(false); setShowEmoji(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), 80);
  };

  const addReaction = (msgId, emoji) => {
    setMsgReactions(p => ({ ...p, [msgId]: p[msgId]===emoji ? null : emoji }));
    setShowEmoji(null);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,20,40,0.55)", zIndex:1500, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(5px)" }}>
      <div style={{ background:"#fff", borderRadius:"22px 22px 0 0", width:"100%", maxWidth:560, height:"85vh", display:"flex", flexDirection:"column", boxShadow:"0 -12px 60px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>

        {/* Header */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button onClick={onClose} style={{ border:"none", background:"#f1f5f9", borderRadius:8, width:30, height:30, cursor:"pointer", fontSize:14, color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div style={{ position:"relative" }}>
            <Av letter={convo.with.av} size={38}/>
            {convo.with.badge && <span style={{ position:"absolute", bottom:-2, right:-2, fontSize:12, background:"#fff", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #e8eaed" }}>{convo.with.badge.split(" ")[0]}</span>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{convo.with.name}</div>
            {convo.with.badge && <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{convo.with.badge}</div>}
          </div>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" }}/>
          <span style={{ fontSize:11, color:"#22c55e", fontFamily:ff }}>Online</span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
          {localMessages.map(m => (
            <div key={m.id} style={{ display:"flex", flexDirection:"column", alignItems: m.mine ? "flex-end" : "flex-start" }}>
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, flexDirection: m.mine ? "row-reverse" : "row" }}>
                {!m.mine && <Av letter={m.av} size={28}/>}
                <div style={{ maxWidth:"72%" }}>
                  {/* Shared listing card */}
                  {m.sharedListing && (
                    <div style={{ background: m.mine?"#dbeafe":"#f1f5f9", borderRadius:12, overflow:"hidden", marginBottom:6, border:"1px solid #e8eaed" }}>
                      <img src={m.sharedListing.img} alt="" style={{ width:"100%", height:100, objectFit:"cover" }}/>
                      <div style={{ padding:"8px 10px" }}>
                        <div style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{formatPrice(m.sharedListing)}</div>
                        <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{m.sharedListing.address}</div>
                      </div>
                    </div>
                  )}
                  {/* Message bubble */}
                  {m.text && (
                    <div onClick={() => setShowEmoji(showEmoji===m.id ? null : m.id)}
                      style={{ background: m.mine?"#2563eb":"#f1f5f9", color: m.mine?"#fff":"#1a202c", padding:"10px 14px", borderRadius: m.mine?"16px 16px 4px 16px":"16px 16px 16px 4px", fontSize:14, fontFamily:ff, lineHeight:1.5, cursor:"pointer", userSelect:"none" }}>
                      {m.text}
                    </div>
                  )}
                  {/* Reaction */}
                  {msgReactions[m.id] && (
                    <div style={{ fontSize:16, marginTop:2, textAlign: m.mine?"right":"left" }}>{msgReactions[m.id]}</div>
                  )}
                  {/* Emoji picker */}
                  {showEmoji===m.id && (
                    <div style={{ display:"flex", gap:4, marginTop:4, background:"#fff", border:"1px solid #e8eaed", borderRadius:20, padding:"4px 8px", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
                      {EMOJIS.map(e => (
                        <button key={e} onClick={() => addReaction(m.id, e)} style={{ border:"none", background:"none", fontSize:16, cursor:"pointer", padding:"2px", borderRadius:6, transition:"transform 0.1s" }}
                          onMouseEnter={ev => ev.target.style.transform="scale(1.3)"}
                          onMouseLeave={ev => ev.target.style.transform="scale(1)"}>
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize:10, color:"#94a3b8", fontFamily:ff, marginTop:3, paddingLeft: m.mine?0:36, paddingRight: m.mine?4:0 }}>{m.time}</div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>

        {/* Share listing picker */}
        {showListings && (
          <div style={{ borderTop:"1px solid #f1f5f9", padding:"10px 18px", maxHeight:180, overflowY:"auto", flexShrink:0 }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:8 }}>Share a listing</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {listings.slice(0,6).map(l => (
                <div key={l.id} onClick={() => send(l)} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 10px", background:"#f8fafc", borderRadius:10, cursor:"pointer", border:"1px solid #f1f5f9", transition:"background 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#eff6ff"}
                  onMouseLeave={e=>e.currentTarget.style.background="#f8fafc"}>
                  <img src={l.img} alt="" style={{ width:44, height:44, borderRadius:8, objectFit:"cover", flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{formatPrice(l)}</div>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{l.address} · {l.hood}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding:"10px 18px 20px", borderTop:"1px solid #f1f5f9", flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
            <button onClick={() => { setShowListings(o=>!o); setShowEmoji(null); }} style={{ border:`1.5px solid ${showListings?"#2563eb":"#e8eaed"}`, background:showListings?"#eff6ff":"#fff", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }} title="Share a listing">🏠</button>
            <div style={{ flex:1, background:"#f8fafc", borderRadius:14, border:"1.5px solid #e8eaed", padding:"9px 12px", display:"flex", gap:8, alignItems:"flex-end" }}>
              <textarea value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={`Message ${convo.with.name.split(" ")[0]}...`} rows={1}
                style={{ flex:1, border:"none", background:"transparent", resize:"none", outline:"none", fontSize:14, color:"#1a202c", lineHeight:1.5, maxHeight:80, overflowY:"auto", fontFamily:ff }}/>
            </div>
            <button onClick={() => send()} disabled={!txt.trim()} style={{ background:txt.trim()?"#2563eb":"#e2e8f0", color:txt.trim()?"#fff":"#94a3b8", border:"none", borderRadius:10, width:36, height:36, cursor:txt.trim()?"pointer":"default", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── POST LISTING MODAL (Landlord) ────────────────────────────────────────────
function PostListingModal({ user, onClose, onPost }) {
  const [step, setStep] = useState(1); // 1=details, 2=verify, 3=confirm
  const [address, setAddress]   = useState("");
  const [price, setPrice]       = useState("");
  const [beds, setBeds]         = useState("1");
  const [baths, setBaths]       = useState("1");
  const [sqft, setSqft]         = useState("");
  const [desc, setDesc]         = useState("");
  const [photos, setPhotos]     = useState([]);
  const [docType, setDocType]   = useState("");
  const [verifyDoc, setVerifyDoc] = useState(null);
  const [posted, setPosted]     = useState(false);
  const docRef  = useRef();
  const photoRef = useRef();

  const detailsComplete = address.trim() && price.trim() && sqft.trim();
  const verifyComplete  = docType && verifyDoc;

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files||[]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPhotos(p => [...p, { name:file.name, preview:ev.target.result }]);
      reader.readAsDataURL(file);
    });
  };

  const handlePost = () => {
    setPosted(true);
    setTimeout(() => {
      onPost && onPost({ address, price:Number(price), beds:Number(beds), baths:Number(baths), sqft:Number(sqft), desc });
      onClose();
    }, 1800);
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(10,20,40,0.6)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(5px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width:"92%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#1a202c", fontFamily:serif }}>Post a Rental Listing</div>
            <div style={{ fontSize:12, color:"#94a3b8", fontFamily:ff, marginTop:2 }}>
              {user.accountType==="management" ? `${user.managementCompany||"Park Property Group"} · Managed property` : "Individual landlord · Free"}
            </div>
          </div>
          <button onClick={onClose} style={{ border:"none", background:"#f1f5f9", borderRadius:8, width:30, height:30, cursor:"pointer", fontSize:14, color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{ display:"flex", gap:6, padding:"14px 24px 0" }}>
          {["Listing Details","Verify Ownership","Review & Post"].map((s,i) => (
            <div key={s} style={{ flex:1, textAlign:"center" }}>
              <div style={{ height:3, borderRadius:2, background: step>i+1?"#16a34a":step===i+1?"#ea580c":"#e2e8f0", marginBottom:4, transition:"background 0.3s" }}/>
              <div style={{ fontSize:10, color: step===i+1?"#ea580c":"#94a3b8", fontWeight: step===i+1?700:400, fontFamily:ff }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ padding:"20px 24px 24px" }}>

          {/* STEP 1 — Listing Details */}
          {step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5, fontFamily:ff }}>Full Address <span style={{ color:"#dc2626" }}>*</span></label>
                <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g. 415 Edgecombe Ave, Apt 3B, New York, NY" style={{ width:"100%", padding:"10px 12px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, fontFamily:ff, outline:"none", color:"#1a202c" }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[
                  { l:"Monthly Rent *", v:price, s:setPrice, p:"$2,500" },
                  { l:"Sq Ft *",        v:sqft,  s:setSqft,  p:"750" },
                ].map(({l,v,s,p}) => (
                  <div key={l} style={{ gridColumn: l.includes("Rent") ? "span 2" : "span 1" }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5, fontFamily:ff }}>{l}</label>
                    <input value={v} onChange={e=>s(e.target.value)} placeholder={p} style={{ width:"100%", padding:"10px 12px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, fontFamily:ff, outline:"none", color:"#1a202c" }}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { l:"Bedrooms", v:beds, s:setBeds, opts:["Studio","1","2","3","4+"] },
                  { l:"Bathrooms", v:baths, s:setBaths, opts:["1","1.5","2","2.5","3+"] },
                ].map(({l,v,s,opts}) => (
                  <div key={l}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5, fontFamily:ff }}>{l}</label>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {opts.map(o => (
                        <button key={o} onClick={()=>s(o)} style={{ border:`1.5px solid ${v===o?"#ea580c":"#e2e8f0"}`, background:v===o?"#fff7ed":"#fff", color:v===o?"#ea580c":"#64748b", borderRadius:8, padding:"5px 10px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5, fontFamily:ff }}>Description</label>
                <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe your unit — amenities, pet policy, utilities, etc." rows={3} style={{ width:"100%", padding:"10px 12px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, fontFamily:ff, outline:"none", color:"#1a202c", resize:"none", lineHeight:1.5 }}/>
              </div>

              {/* Photo upload */}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5, fontFamily:ff }}>
                  Photos <span style={{ fontSize:11, color:"#94a3b8", fontWeight:400 }}>— strongly recommended</span>
                </label>
                <input ref={photoRef} type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display:"none" }}/>
                {photos.length > 0 && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8, marginBottom:8 }}>
                    {photos.map((p,i) => (
                      <div key={i} style={{ position:"relative", borderRadius:10, overflow:"hidden", aspectRatio:"4/3" }}>
                        <img src={p.preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        <button onClick={() => setPhotos(prev => prev.filter((_,j) => j!==i))}
                          style={{ position:"absolute", top:5, right:5, border:"none", background:"rgba(0,0,0,0.5)", color:"#fff", borderRadius:"50%", width:20, height:20, cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                        {i===0 && <span style={{ position:"absolute", bottom:5, left:5, fontSize:9, fontWeight:700, background:"rgba(0,0,0,0.6)", color:"#fff", padding:"2px 6px", borderRadius:4, fontFamily:ff }}>COVER</span>}
                      </div>
                    ))}
                    {photos.length < 10 && (
                      <div onClick={() => photoRef.current?.click()} style={{ border:"2px dashed #fed7aa", borderRadius:10, aspectRatio:"4/3", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"#fff7ed" }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="#ea580c"}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="#fed7aa"}>
                        <span style={{ fontSize:20 }}>+</span>
                        <span style={{ fontSize:10, color:"#ea580c", fontFamily:ff, fontWeight:600 }}>Add more</span>
                      </div>
                    )}
                  </div>
                )}
                {photos.length === 0 && (
                  <div onClick={() => photoRef.current?.click()} style={{ border:"2px dashed #fed7aa", borderRadius:12, padding:"20px", textAlign:"center", cursor:"pointer", background:"#fff7ed", transition:"all 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#ea580c"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#fed7aa"}>
                    <div style={{ fontSize:28, marginBottom:6 }}>📸</div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#ea580c", fontFamily:ff }}>Upload property photos</div>
                    <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:3 }}>Up to 10 photos · JPG, PNG · First photo is the cover</div>
                  </div>
                )}
              </div>

              <button onClick={()=>setStep(2)} disabled={!detailsComplete} style={{ background:detailsComplete?"#ea580c":"#e2e8f0", color:detailsComplete?"#fff":"#94a3b8", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:detailsComplete?"pointer":"default", fontFamily:ff, transition:"all 0.2s" }}>
                Continue to Verification →
              </button>
            </div>
          )}

          {/* STEP 2 — Verify Ownership */}
          {step===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:12, padding:"12px 14px" }}>
                <p style={{ fontSize:13, color:"#92400e", fontFamily:ff, lineHeight:1.6 }}>
                  Before your listing goes live, we need to confirm you have the authority to list <strong>{address}</strong>.
                  {user.accountType==="management"
                    ? " Upload a document confirming your management authority for this property."
                    : " This keeps the community trustworthy and protects everyone. It only takes a moment."
                  }
                </p>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:8, fontFamily:ff }}>
                  {user.accountType==="management" ? "Select management authority document" : "Select document type"} <span style={{ color:"#dc2626" }}>*</span>
                </label>
                {(user.accountType==="management" ? [
                  { v:"contract", l:"📋 Property management contract" },
                  { v:"authorization", l:"📝 Owner authorization letter" },
                  { v:"license", l:"🏢 Business license + property address match" },
                ] : [
                  { v:"deed",     l:"📜 Property deed or title document" },
                  { v:"tax",      l:"🧾 Property tax bill in your name" },
                  { v:"mortgage", l:"🏦 Mortgage statement showing ownership" },
                ]).map(({v,l}) => (
                  <label key={v} onClick={()=>setDocType(v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:`2px solid ${docType===v?"#ea580c":"#e2e8f0"}`, borderRadius:10, cursor:"pointer", background:docType===v?"#fff7ed":"#fff", transition:"all 0.15s", marginBottom:8 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${docType===v?"#ea580c":"#cbd5e1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {docType===v && <div style={{ width:8, height:8, borderRadius:"50%", background:"#ea580c" }}/>}
                    </div>
                    <span style={{ fontSize:13, color:"#1a202c", fontFamily:ff }}>{l}</span>
                  </label>
                ))}
              </div>
              <input ref={docRef} type="file" accept="image/*,.pdf" onChange={e=>setVerifyDoc(e.target.files?.[0]||null)} style={{ display:"none" }}/>
              {verifyDoc ? (
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#f0fdf4", border:"2px solid #bbf7d0", borderRadius:12 }}>
                  <span style={{ fontSize:20 }}>📄</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#15803d", fontFamily:ff }}>✓ Got it — looks great!</div>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>{verifyDoc.name}</div>
                  </div>
                  <button onClick={()=>setVerifyDoc(null)} style={{ border:"none", background:"none", cursor:"pointer", color:"#94a3b8", fontSize:13 }}>✕</button>
                </div>
              ) : (
                <div onClick={()=>docRef.current?.click()} style={{ border:"2px dashed #fed7aa", borderRadius:12, padding:"18px", textAlign:"center", cursor:"pointer", background:"#fff7ed" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#ea580c"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#fed7aa"}>
                  <div style={{ fontSize:24, marginBottom:4 }}>📎</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#ea580c", fontFamily:ff }}>Upload your document</div>
                  <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginTop:2 }}>PDF, JPG or PNG · Max 10MB</div>
                </div>
              )}
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setStep(1)} style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>← Back</button>
                <button onClick={()=>setStep(3)} disabled={!verifyComplete} style={{ flex:2, background:verifyComplete?"#ea580c":"#e2e8f0", color:verifyComplete?"#fff":"#94a3b8", border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:700, cursor:verifyComplete?"pointer":"default", fontFamily:ff, transition:"all 0.2s" }}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Post */}
          {step===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {posted ? (
                <div style={{ textAlign:"center", padding:"30px 0" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
                  <div style={{ fontSize:18, fontWeight:800, color:"#15803d", fontFamily:serif, marginBottom:6 }}>Your listing is live!</div>
                  <p style={{ fontSize:13, color:"#64748b", fontFamily:ff }}>It will appear in the Chathouse feed shortly and the community can start commenting.</p>
                </div>
              ) : (
                <>
                  <div style={{ background:"#f8fafc", borderRadius:12, border:"1px solid #e8eaed", padding:"14px 16px" }}>
                    <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:10 }}>Listing Summary</p>
                    {/* Cover photo preview */}
                    {photos.length > 0 && (
                      <div style={{ position:"relative", borderRadius:10, overflow:"hidden", height:140, marginBottom:10 }}>
                        <img src={photos[0].preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6, fontFamily:ff }}>
                          📸 {photos.length} photo{photos.length!==1?"s":""}
                        </div>
                        <span style={{ position:"absolute", bottom:8, left:8, fontSize:9, fontWeight:700, background:"rgba(0,0,0,0.6)", color:"#fff", padding:"2px 6px", borderRadius:4, fontFamily:ff }}>COVER</span>
                      </div>
                    )}
                    {[
                      { l:"Address",  v:address },
                      { l:"Rent",     v:`$${Number(price).toLocaleString()}/mo` },
                      { l:"Beds",     v:beds==="Studio"?"Studio":`${beds} bed` },
                      { l:"Baths",    v:`${baths} bath` },
                      { l:"Sq Ft",    v:`${Number(sqft).toLocaleString()} sqft` },
                      { l:"Photos",   v: photos.length > 0 ? `${photos.length} photo${photos.length!==1?"s":""} uploaded` : "None — consider adding photos" },
                      { l:"Posted by", v: user.accountType==="management" ? `${user.name} · ${user.managementCompany||"Park Property Group"} · ✓ Verified Manager` : `${user.name} · ✓ Verified Landlord` },
                    ].map(({l,v}) => (
                      <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #f1f5f9" }}>
                        <span style={{ fontSize:12, color:"#94a3b8", fontFamily:ff }}>{l}</span>
                        <span style={{ fontSize:12, fontWeight:600, color: l==="Photos"&&photos.length===0?"#f59e0b":"#1a202c", fontFamily:ff }}>{v}</span>
                      </div>
                    ))}
                    {desc && <p style={{ fontSize:12, color:"#64748b", fontFamily:ff, marginTop:10, lineHeight:1.55 }}>{desc}</p>}
                  </div>
                  <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px" }}>
                    <p style={{ fontSize:11, color:"#15803d", fontFamily:ff }}>🔒 Ownership verified · Your document is stored securely and never shared publicly.</p>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setStep(2)} style={{ flex:1, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:ff }}>← Back</button>
                    <button onClick={handlePost} style={{ flex:2, background:"#ea580c", color:"#fff", border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:ff }}>🏡 Post My Listing</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── LANDLORD COMMUNITY DATA ──────────────────────────────────────────────────
const LANDLORD_COMMUNITY_CITIES = ["New York, NY", "Brooklyn, NY", "Chicago, IL", "Atlanta, GA", "Houston, TX", "Los Angeles, CA"];

const LANDLORD_COMMUNITY_CHANNELS = [
  { value:"legal",     label:"🏛️ Legal & Leases",      desc:"Lease questions, evictions, tenant rights, local laws" },
  { value:"repairs",   label:"🔧 Maintenance & Repairs", desc:"Contractors, emergencies, renovations, costs" },
  { value:"screening", label:"👤 Tenant Screening",      desc:"Applications, background checks, red flags" },
  { value:"pricing",   label:"💰 Rent & Pricing",        desc:"Setting rent, increases, market rates" },
  { value:"general",   label:"📋 General Questions",     desc:"Anything that doesn't fit elsewhere" },
  { value:"referrals", label:"🤝 Referrals",             desc:"Recommend attorneys, contractors, accountants nearby" },
];

const LANDLORD_COMMUNITY_POSTS = {
  "New York, NY": {
    legal: [
      { id:1, av:"J", name:"James R.", time:"2h ago", text:"My tenant is 5 weeks behind on rent. What's the official notice process in New York before I can start proceedings? I've never had to do this before.", likes:3, replies:[
        { id:11, av:"P", name:"Paula M.", time:"2h ago", text:"You need to serve a 14-Day Rent Demand first. If they don't pay within 14 days you can file in housing court. Make sure everything is in writing — certified mail plus a copy slid under the door." },
        { id:12, av:"G", name:"Greg T.", time:"1h ago", text:"Agreed with Paula. Also document EVERYTHING from this point on. Texts, emails, all of it. Housing court in NYC moves slow but judges take documentation seriously." },
      ]},
      { id:2, av:"M", name:"Maria C.", time:"1 day ago", text:"Anyone know if I'm legally required to allow emotional support animals even if my lease says no pets? Getting conflicting answers online.", likes:7, replies:[
        { id:21, av:"J", name:"James R.", time:"1 day ago", text:"Yes unfortunately. ESAs are protected under the Fair Housing Act so a no-pets clause doesn't apply to them. They need to provide documentation from a licensed mental health professional though." },
      ]},
    ],
    repairs: [
      { id:3, av:"T", name:"Tony B.", time:"4h ago", text:"Need a reliable licensed plumber in the Bronx who won't charge an arm and a leg for a simple water heater replacement. Anyone have a referral?", likes:5, replies:[
        { id:31, av:"P", name:"Paula M.", time:"3h ago", text:"DM me — I have a guy who's been doing my buildings for 8 years. Fair prices and actually shows up on time which is rare." },
      ]},
      { id:4, av:"G", name:"Greg T.", time:"2 days ago", text:"How often are you all replacing appliances? My stove is 12 years old and I'm wondering if I should proactively replace it or wait until it breaks.", likes:9, replies:[
        { id:41, av:"M", name:"Maria C.", time:"2 days ago", text:"I replace proactively around 12-15 years for major appliances. A broken stove in the middle of a lease is way more stressful than a planned swap." },
        { id:42, av:"T", name:"Tony B.", time:"1 day ago", text:"Also consider that newer appliances are a selling point when re-listing. I updated my kitchen 2 years ago and got $200 more per month." },
      ]},
    ],
    screening: [
      { id:5, av:"P", name:"Paula M.", time:"6h ago", text:"What income-to-rent ratio do you all require? I've been doing 40x the monthly rent but wondering if that's too strict for NYC.", likes:11, replies:[
        { id:51, av:"J", name:"James R.", time:"5h ago", text:"40x is standard in NYC. Some landlords go 45x for higher rent units. I also check that their income is stable — 2 years at the same employer matters more to me than just the number." },
        { id:52, av:"G", name:"Greg T.", time:"4h ago", text:"I do 40x but I also look at credit score. Anything below 680 I require a guarantor. Had too many surprises early on." },
      ]},
    ],
    pricing: [
      { id:6, av:"G", name:"Greg T.", time:"3 days ago", text:"Upper West Side 1BR — currently at $3,100. Lease renews in 2 months. What's the market saying right now for a well-maintained pre-war?", likes:6, replies:[
        { id:61, av:"M", name:"Maria C.", time:"3 days ago", text:"I'd say $3,200–3,400 is reasonable if it's been updated. Pre-war with good light and original details commands a premium right now. Check StreetEasy comps for your specific block." },
      ]},
    ],
    general: [
      { id:7, av:"M", name:"Maria C.", time:"5h ago", text:"Does anyone use a property management app for just one or two units? Feels overkill but I'm drowning in spreadsheets.", likes:14, replies:[
        { id:71, av:"T", name:"Tony B.", time:"4h ago", text:"I use Avail for two units — it's free for basic features and handles rent collection, leases, and maintenance requests. Total game changer." },
        { id:72, av:"P", name:"Paula M.", time:"3h ago", text:"Seconding Avail. The lease templates alone saved me hundreds in attorney fees." },
      ]},
    ],
    referrals: [
      { id:8, av:"T", name:"Tony B.", time:"1 day ago", text:"Looking for a real estate attorney in Brooklyn who handles landlord-tenant issues. Reasonable rates — I just need someone for occasional consultations, not a retainer.", likes:8, replies:[
        { id:81, av:"G", name:"Greg T.", time:"1 day ago", text:"I use someone in Park Slope — she charges $200/hr for consultations which is fair for Brooklyn. DM me and I'll send you her info." },
      ]},
    ],
  },
};

function ManagementDashboard({ user, listings, onOpenListing }) {
  const [dashTab, setDashTab] = useState("listings");
  const [activeListingId, setActiveListingId] = useState(null);
  const [responses, setResponses] = useState({});
  const [draftText, setDraftText] = useState({});
  const [showPostListing, setShowPostListing] = useState(false);
  // Community state
  const [communityCity, setCommunityCity] = useState("New York, NY");
  const [communityChannel, setCommunityChannel] = useState("legal");
  const [communityPosts, setCommunityPosts] = useState(LANDLORD_COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [postLikes, setPostLikes] = useState({});

  const claimed = user.accountType==="landlord"
    ? (user.claimedListings || DEMO_ACCOUNTS.landlord.claimedListings)
    : (user.claimedListings || DEMO_ACCOUNTS.management.claimedListings);
  const stats = user.accountType==="landlord"
    ? (user.stats || DEMO_ACCOUNTS.landlord.stats)
    : (user.stats || DEMO_ACCOUNTS.management.stats);

  const getListingComments = (listingId) => {
    const l = listings.find(x => x.id===listingId);
    return l?.comments || [];
  };

  const isMgmtComment = (c) => c.roleLabel?.includes("Tenant") || c.roleLabel?.includes("Neighbor");

  const submitResponse = (listingId, commentId) => {
    const key = `${listingId}-${commentId}`;
    if (!draftText[key]?.trim()) return;
    setResponses(p => ({...p, [key]: draftText[key].trim()}));
    setDraftText(p => ({...p, [key]: ""}));
  };

  const StatCard = ({ icon, label, val, color }) => (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", flex:1 }}>
      <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff, marginBottom:4 }}>{icon} {label}</div>
      <div style={{ fontSize:26, fontWeight:800, color:color||"#1a202c", fontFamily:serif }}>{val}</div>
    </div>
  );

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      {/* Welcome bar */}
      <div style={{ background: user.accountType==="landlord" ? "linear-gradient(135deg,#fff7ed,#ffedd5)" : "linear-gradient(135deg,#fef2f2,#fee2e2)", border:`1.5px solid ${user.accountType==="landlord"?"#fed7aa":"#fecaca"}`, borderRadius:14, padding:"16px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:"50%", background: user.accountType==="landlord"?"#ea580c":"#dc2626", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
          {user.accountType==="landlord" ? "🏡" : "🏢"}
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color: user.accountType==="landlord"?"#7c2d12":"#7f1d1d", fontFamily:ff }}>Welcome back, {user.name.split(" ")[0]}</div>
          <div style={{ fontSize:12, color: user.accountType==="landlord"?"#ea580c":"#dc2626", fontFamily:ff }}>
            {user.accountType==="landlord"
              ? "Individual Landlord · Free Account"
              : `${user.managementCompany || "Park Property Group"} · ${(user.managementTier||"pro").charAt(0).toUpperCase()+(user.managementTier||"pro").slice(1)} plan`
            }
          </div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, background: user.accountType==="landlord"?"#ea580c":"#dc2626", color:"#fff", fontFamily:ff }}>
          {user.accountType==="landlord" ? "✓ Verified Landlord" : "✓ Verified Manager"}
        </div>
      </div>

      {/* Dashboard tabs — only for landlords */}
      {user.accountType==="landlord" && (
        <div style={{ display:"flex", gap:2, borderBottom:"1px solid #f1f5f9", marginBottom:22 }}>
          {[{k:"listings",l:"🏠 My Listings"},{k:"community",l:"👥 Landlord Community"}].map(({k,l}) => (
            <button key={k} onClick={()=>setDashTab(k)} style={{ border:"none", background:"transparent", padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer", color:dashTab===k?"#ea580c":"#64748b", borderBottom:dashTab===k?"2.5px solid #ea580c":"2.5px solid transparent", transition:"all 0.15s", fontFamily:ff }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* LISTINGS TAB */}
      {(dashTab==="listings" || user.accountType!=="landlord") && (<>

      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
        <StatCard icon="🏢" label="Claimed Listings"   val={stats.claimedListings} color="#ea580c"/>
        <StatCard icon="💬" label="Total Responses"    val={stats.totalResponses}/>
        <StatCard icon="⚡" label="Avg Response Time"  val={stats.avgResponseTime}/>
        <StatCard icon="📊" label="Sentiment Score"    val={`${stats.sentimentScore}%`} color="#16a34a"/>
      </div>

      {/* Claimed listings */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:22 }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>🏢 Your Claimed Listings</span>
          {user.accountType==="landlord" ? (
            <button onClick={()=>setShowPostListing(true)} style={{ fontSize:12, fontWeight:700, padding:"7px 16px", background:"#ea580c", color:"#fff", border:"none", borderRadius:20, cursor:"pointer", fontFamily:ff }}>+ Post a Listing</button>
          ) : (
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setShowPostListing(true)} style={{ fontSize:12, fontWeight:700, padding:"6px 14px", background:"#dc2626", color:"#fff", border:"none", borderRadius:20, cursor:"pointer", fontFamily:ff }}>+ Post a Listing</button>
              <button style={{ fontSize:12, fontWeight:600, padding:"6px 14px", background:"#fff7ed", color:"#ea580c", border:"1.5px solid #fed7aa", borderRadius:20, cursor:"pointer", fontFamily:ff }}>+ Claim Existing</button>
            </div>
          )}
        </div>
        <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:10 }}>
          {claimed.map(cl => {
            const comments = getListingComments(cl.listingId);
            const isOpen = activeListingId===cl.listingId;
            return (
              <div key={cl.listingId} style={{ borderRadius:12, border:`1.5px solid ${isOpen?"#ea580c":"#f1f5f9"}`, overflow:"hidden", transition:"border-color 0.2s" }}>
                {/* Listing header */}
                <div onClick={() => setActiveListingId(isOpen ? null : cl.listingId)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background: isOpen?"#fff7ed":"#f8fafc", cursor:"pointer" }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:"#ea580c", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏠</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{cl.address}</div>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>📍 {cl.hood} · Claimed {cl.verifiedDate}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background:"#f0fdf4", color:"#15803d", fontFamily:ff }}>✓ Verified</span>
                    <span style={{ fontSize:11, color:"#64748b", fontFamily:ff }}>💬 {cl.totalComments}</span>
                    {cl.flaggedComments > 0 && <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background:"#fef2f2", color:"#dc2626", fontFamily:ff }}>⚑ {cl.flaggedComments} flagged</span>}
                    <span style={{ fontSize:12, color:"#94a3b8" }}>{isOpen?"▲":"▼"}</span>
                  </div>
                </div>

                {/* Expanded comments for this listing */}
                {isOpen && (
                  <div style={{ borderTop:"1px solid #fed7aa", padding:"14px 16px", display:"flex", flexDirection:"column", gap:14 }}>
                    {comments.length===0 && <p style={{ fontSize:13, color:"#94a3b8", fontFamily:ff, textAlign:"center", padding:"20px 0" }}>No comments yet on this listing.</p>}
                    {comments.map(c => {
                      const key = `${cl.listingId}-${c.id}`;
                      const existingResponse = responses[key];
                      const isFlagged = isMgmtComment(c);
                      return (
                        <div key={c.id} style={{ background: isFlagged?"#fef2f2":"#f8fafc", borderRadius:10, border:`1px solid ${isFlagged?"#fecaca":"#f1f5f9"}`, padding:"12px 14px" }}>
                          {/* Original comment */}
                          <div style={{ display:"flex", gap:10, marginBottom: existingResponse || !existingResponse ? 10 : 0 }}>
                            <Av letter={c.av} size={30}/>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                                <span style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{c.user}</span>
                                {c.roleLabel && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#f1f5f9", color:"#475569", fontFamily:ff }}>{c.roleLabel}</span>}
                                {c.verified && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#f0fdf4", color:"#15803d", border:"1px solid #bbf7d0", fontFamily:ff }}>✓ Verified</span>}
                                {isFlagged && <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#fef2f2", color:"#dc2626", fontFamily:ff }}>⚑ Management relevant</span>}
                                <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{c.time}</span>
                              </div>
                              <p style={{ fontSize:13, color:"#334155", lineHeight:1.55, fontFamily:ff }}>{c.text}</p>
                            </div>
                          </div>

                          {/* Existing official response */}
                          {existingResponse && (
                            <div style={{ background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#ea580c", color:"#fff", fontFamily:ff }}>🏢 Official Response</span>
                                <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>Just now</span>
                              </div>
                              <p style={{ fontSize:13, color:"#7c2d12", lineHeight:1.55, fontFamily:ff }}>{existingResponse}</p>
                            </div>
                          )}

                          {/* Response input */}
                          {!existingResponse && (
                            <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                              <div style={{ flex:1, background:"#fff", borderRadius:10, border:"1.5px solid #fed7aa", padding:"8px 12px" }}>
                                <textarea
                                  value={draftText[key]||""}
                                  onChange={e => setDraftText(p=>({...p,[key]:e.target.value}))}
                                  placeholder="Write an official response as property manager..."
                                  rows={1}
                                  style={{ width:"100%", border:"none", background:"transparent", resize:"none", outline:"none", fontSize:13, color:"#1a202c", lineHeight:1.5, maxHeight:80, overflowY:"auto", fontFamily:ff }}/>
                              </div>
                              <button onClick={() => submitResponse(cl.listingId, c.id)} disabled={!draftText[key]?.trim()} style={{ background: draftText[key]?.trim()?"#ea580c":"#e2e8f0", color: draftText[key]?.trim()?"#fff":"#94a3b8", border:"none", borderRadius:9, padding:"8px 14px", fontSize:12, fontWeight:700, cursor: draftText[key]?.trim()?"pointer":"default", flexShrink:0, fontFamily:ff, transition:"all 0.15s" }}>
                                Respond
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sentiment overview */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8eaed", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1a202c", fontFamily:ff }}>📊 Portfolio Sentiment</span>
        </div>
        <div style={{ padding:"16px 18px" }}>
          {claimed.map(cl => {
            const score = cl.listingId===8 ? 58 : cl.listingId===7 ? 88 : 76;
            const color = score>=75?"#16a34a":score>=50?"#f59e0b":"#dc2626";
            return (
              <div key={cl.listingId} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color:"#475569", fontFamily:ff }}>{cl.address}</span>
                  <span style={{ fontSize:12, fontWeight:700, color, fontFamily:ff }}>{score}% positive</span>
                </div>
                <div style={{ height:7, background:"#f1f5f9", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${score}%`, background:color, borderRadius:4, transition:"width 0.5s" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPostListing && (
        <PostListingModal
          user={user}
          onClose={()=>setShowPostListing(false)}
          onPost={listing => setShowPostListing(false)}
        />
      )}

      {/* Zip Code Advertising — management companies only */}
      {user.accountType==="management" && <ZipCodeAdvertising accountType="management"/>}

      </>)}

      {/* COMMUNITY TAB — landlords only */}
      {dashTab==="community" && user.accountType==="landlord" && (
        <div>
          {/* City selector */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 18px", marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff, marginBottom:10 }}>Your City</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {LANDLORD_COMMUNITY_CITIES.map(city => (
                <button key={city} onClick={()=>setCommunityCity(city)} style={{ border:`1.5px solid ${communityCity===city?"#ea580c":"#e2e8f0"}`, background:communityCity===city?"#fff7ed":"#fff", color:communityCity===city?"#ea580c":"#64748b", padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff, transition:"all 0.15s" }}>
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Channel selector */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            {LANDLORD_COMMUNITY_CHANNELS.map(ch => (
              <button key={ch.value} onClick={()=>setCommunityChannel(ch.value)} style={{ border:`1.5px solid ${communityChannel===ch.value?"#ea580c":"#e2e8f0"}`, background:communityChannel===ch.value?"#fff7ed":"#fff", color:communityChannel===ch.value?"#ea580c":"#64748b", padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:ff, transition:"all 0.15s", whiteSpace:"nowrap" }}>
                {ch.label}
              </button>
            ))}
          </div>

          {/* Channel description */}
          <div style={{ background:"linear-gradient(135deg,#fff7ed,#ffedd5)", border:"1.5px solid #fed7aa", borderRadius:12, padding:"10px 14px", marginBottom:16 }}>
            <p style={{ fontSize:13, color:"#92400e", fontFamily:ff }}>
              {LANDLORD_COMMUNITY_CHANNELS.find(c=>c.value===communityChannel)?.label} — <span style={{ fontWeight:400 }}>{LANDLORD_COMMUNITY_CHANNELS.find(c=>c.value===communityChannel)?.desc}</span>
            </p>
          </div>

          {/* New post input */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", padding:"14px 16px", marginBottom:16 }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
              <Av letter={user.av} size={36}/>
              <div style={{ flex:1, background:"#f8fafc", borderRadius:12, border:"1.5px solid #e8eaed", padding:"10px 14px" }}>
                <textarea value={newPostText} onChange={e=>setNewPostText(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();
                    if(!newPostText.trim()) return;
                    const newPost = { id:Date.now(), av:user.av, name:user.name, time:"Just now", text:newPostText.trim(), likes:0, replies:[] };
                    setCommunityPosts(p => ({
                      ...p,
                      [communityCity]: { ...(p[communityCity]||{}), [communityChannel]: [newPost, ...((p[communityCity]||{})[communityChannel]||[])] }
                    }));
                    setNewPostText("");
                  }}}
                  placeholder={`Ask the ${communityCity} landlord community something...`}
                  rows={2} style={{ width:"100%", border:"none", background:"transparent", resize:"none", outline:"none", fontSize:13, color:"#1a202c", lineHeight:1.55, fontFamily:ff }}/>
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
                  <button onClick={() => {
                    if(!newPostText.trim()) return;
                    const newPost = { id:Date.now(), av:user.av, name:user.name, time:"Just now", text:newPostText.trim(), likes:0, replies:[] };
                    setCommunityPosts(p => ({
                      ...p,
                      [communityCity]: { ...(p[communityCity]||{}), [communityChannel]: [newPost, ...((p[communityCity]||{})[communityChannel]||[])] }
                    }));
                    setNewPostText("");
                  }} disabled={!newPostText.trim()} style={{ background:newPostText.trim()?"#ea580c":"#e2e8f0", color:newPostText.trim()?"#fff":"#94a3b8", border:"none", borderRadius:8, padding:"6px 16px", fontSize:12, fontWeight:700, cursor:newPostText.trim()?"pointer":"default", fontFamily:ff }}>Post</button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {((communityPosts[communityCity]||{})[communityChannel]||[]).length===0 && (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#94a3b8", fontSize:14, fontFamily:ff }}>
                No posts yet in this channel — be the first to start a conversation!
              </div>
            )}
            {((communityPosts[communityCity]||{})[communityChannel]||[]).map(post => (
              <div key={post.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e8eaed", overflow:"hidden" }}>
                {/* Post */}
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <Av letter={post.av} size={36}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{post.name}</span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#fff7ed", color:"#ea580c", fontFamily:ff }}>🏡 Verified Landlord</span>
                        <span style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{post.time}</span>
                      </div>
                      <p style={{ fontSize:14, color:"#334155", lineHeight:1.6, fontFamily:ff, marginBottom:10 }}>{post.text}</p>
                      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                        <button onClick={()=>setPostLikes(p=>({...p,[post.id]:!p[post.id]}))} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:postLikes[post.id]?"#ea580c":"#94a3b8", fontWeight:600, fontFamily:ff }}>
                          {postLikes[post.id]?"♥":"♡"} {post.likes+(postLikes[post.id]?1:0)}
                        </button>
                        <button onClick={()=>setShowReplyInput(p=>({...p,[post.id]:!p[post.id]}))} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:"#94a3b8", fontWeight:600, fontFamily:ff }}>
                          💬 {post.replies?.length||0} {showReplyInput[post.id]?"· Hide":"· Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {post.replies?.length > 0 && (
                  <div style={{ borderTop:"1px solid #f8fafc", background:"#f8fafc" }}>
                    {post.replies.map((r,i) => (
                      <div key={r.id} style={{ display:"flex", gap:10, padding:"10px 16px", borderBottom: i<post.replies.length-1?"1px solid #f1f5f9":"none" }}>
                        <Av letter={r.av} size={28}/>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                            <span style={{ fontSize:12, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{r.name}</span>
                            <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:20, background:"#fff7ed", color:"#ea580c", fontFamily:ff }}>🏡 Landlord</span>
                            <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{r.time}</span>
                          </div>
                          <p style={{ fontSize:13, color:"#475569", lineHeight:1.55, fontFamily:ff }}>{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply input */}
                {showReplyInput[post.id] && (
                  <div style={{ borderTop:"1px solid #f1f5f9", padding:"10px 16px", display:"flex", gap:10, alignItems:"center" }}>
                    <Av letter={user.av} size={26}/>
                    <input
                      value={replyText[post.id]||""}
                      onChange={e=>setReplyText(p=>({...p,[post.id]:e.target.value}))}
                      onKeyDown={e=>{if(e.key==="Enter"){
                        if(!replyText[post.id]?.trim()) return;
                        const newReply = { id:Date.now(), av:user.av, name:user.name, time:"Just now", text:replyText[post.id].trim() };
                        setCommunityPosts(p => ({
                          ...p,
                          [communityCity]: {
                            ...(p[communityCity]||{}),
                            [communityChannel]: ((p[communityCity]||{})[communityChannel]||[]).map(pp =>
                              pp.id===post.id ? {...pp, replies:[...(pp.replies||[]), newReply]} : pp
                            )
                          }
                        }));
                        setReplyText(p=>({...p,[post.id]:""}));
                      }}}
                      placeholder="Write a reply — press Enter to post..."
                      style={{ flex:1, padding:"7px 12px", border:"1.5px solid #e8eaed", borderRadius:20, fontSize:12, fontFamily:ff, outline:"none", color:"#334155", background:"#fff" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ONBOARDING_STEPS = {
  buyer: [
    {
      icon:"🏘️",
      title:"Welcome to Chathouse",
      subtitle:"Real estate, finally honest.",
      body:"You're now part of a community built for everyone with a connection to real estate — whether you're actively searching, already home, or just know the neighborhood well. Your voice matters here.",
      highlight:null,
      cta:"Let's go →",
    },
    {
      icon:"🔍",
      title:"Browse any listing",
      subtitle:"Filter by city, type, and price.",
      body:"Explore listings synced live from across the country. You don't have to be searching to browse — neighbors, past residents, and curious community members are all welcome here.",
      highlight:"Try filtering by 'For Rent' in New York City",
      cta:"Got it →",
    },
    {
      icon:"💬",
      title:"Your experience is valuable",
      subtitle:"Neighbors. Past tenants. Current residents.",
      body:"Every listing has comments from people with real connections to that property or neighborhood. You can comment as a neighbor, past resident, potential buyer, investor, or just a community member. All roles are welcome.",
      highlight:"Look for the ✓ Verified Tenant badge on resident comments",
      cta:"Got it →",
    },
    {
      icon:"👥",
      title:"Connect with people like you",
      subtitle:"Build community before you move — or where you already live.",
      body:"Tap any commenter's name to see their profile and connect. Whether you're searching for a new home or sharing insights about your current neighborhood, there's a community here for you.",
      highlight:"Tap a commenter's name inside any listing",
      cta:"Got it →",
    },
    {
      icon:"🔔",
      title:"Never miss a listing",
      subtitle:"Set alerts for what matters to you.",
      body:"If you're actively searching, set up a listing alert and get notified the moment something matching your criteria hits the market. Find it in My Profile → My Alerts.",
      highlight:"My Profile → 🔔 My Alerts tab",
      cta:"Start exploring →",
    },
  ],
  agent: [
    {
      icon:"🤝",
      title:"Welcome, Agent",
      subtitle:"Your reputation lives here now.",
      body:"Chathouse is where buyers research their next home — and discover their next agent. Your profile, your comments, and your updates are all visible to thousands of active buyers.",
      highlight:null,
      cta:"Let's go →",
    },
    {
      icon:"📝",
      title:"Your profile is your pitch",
      subtitle:"Show the community who you are.",
      body:"Complete your bio, add your specialties, and start posting market updates. Buyers who trust your content will send you agent requests directly through the app.",
      highlight:"Go to My Profile → Updates to post your first insight",
      cta:"Got it →",
    },
    {
      icon:"🔗",
      title:"Client Links = your reputation score",
      subtitle:"Every linked buyer is a public signal.",
      body:"When a buyer links you as their agent it shows on your profile as a client link count. 100 links earns you the Legendary achievement. Build in public.",
      highlight:"Visible on your profile under Client Links tab",
      cta:"Got it →",
    },
    {
      icon:"👥",
      title:"Your buyer pipeline",
      subtitle:"See every active buyer in real time.",
      body:"Your dashboard shows every client who has linked you, their timeline, pre-approval status, and whether they have a broker. Everything you need to close faster.",
      highlight:"Check your Agent Dashboard tab",
      cta:"Got it →",
    },
    {
      icon:"🔄",
      title:"Your MLS listings sync automatically",
      subtitle:"No manual posting needed.",
      body:"Once you list a property on the MLS it appears on Chathouse within 24–48 hours with your agent profile attached. The community starts commenting — and buyers start finding you.",
      highlight:null,
      cta:"Go to my dashboard →",
    },
  ],
  broker: [
    {
      icon:"🏦",
      title:"Welcome, Broker",
      subtitle:"Your leads are already here.",
      body:"Chathouse is where active buyers search for homes — many without a mortgage broker. Your lead feed shows you exactly who needs you and when.",
      highlight:null,
      cta:"Let's go →",
    },
    {
      icon:"⚡",
      title:"The No-Broker filter",
      subtitle:"Your most powerful tool.",
      body:"Filter your lead feed to show only buyers without a broker. These are warm leads actively searching right now. No cold outreach — just buyers who need what you offer.",
      highlight:"Try the 'No Broker' filter in your Lead Feed",
      cta:"Got it →",
    },
    {
      icon:"📊",
      title:"Full buyer context",
      subtitle:"Know everything before you reach out.",
      body:"Each lead shows their location, property type, timeline, pre-approval status, and whether they have an agent. You know exactly who you're talking to before you say a word.",
      highlight:"Check your Broker Dashboard tab",
      cta:"Got it →",
    },
    {
      icon:"📝",
      title:"Post market insights",
      subtitle:"Let buyers come to you.",
      body:"Post mortgage tips, rate updates, and pre-approval advice. Buyers who trust your content will link you as their broker directly. Your best leads will find you organically.",
      highlight:"Go to My Profile → Updates",
      cta:"Got it →",
    },
    {
      icon:"🔗",
      title:"You're all set",
      subtitle:"Your pipeline starts now.",
      body:"Complete your profile, post your first insight, and check the lead feed daily. Buyers in your market are searching right now — some without a broker.",
      highlight:null,
      cta:"Go to my dashboard →",
    },
  ],
  landlord: [
    {
      icon:"🏡",
      title:"Welcome, Landlord",
      subtitle:"Good landlords have nothing to hide.",
      body:"Chathouse gives verified landlords a free space to respond publicly to comments on their properties, post listings, and connect with a community of landlords just like you.",
      highlight:null,
      cta:"Let's go →",
    },
    {
      icon:"🏠",
      title:"Claim your listing",
      subtitle:"Your property, your voice.",
      body:"Search for your listing and claim it with a quick ownership verification. Once claimed you can respond officially to any comment with your verified Landlord badge.",
      highlight:"Go to My Property → Claim a listing",
      cta:"Got it →",
    },
    {
      icon:"🏢",
      title:"The Official Response badge",
      subtitle:"Respond publicly, build trust.",
      body:"When you respond to a comment it appears with a distinct 🏡 Official Response badge — visible to everyone browsing that listing. Good responses build your reputation.",
      highlight:"Your response can't be deleted by anyone — only by you",
      cta:"Got it →",
    },
    {
      icon:"📋",
      title:"Post a rental listing",
      subtitle:"List directly. No agent needed.",
      body:"Post your rental in 3 steps — add details, verify ownership, and go live. Your listing appears in the Chathouse feed immediately and the community can start commenting.",
      highlight:"Go to My Property → Post a Listing",
      cta:"Got it →",
    },
    {
      icon:"👥",
      title:"The Landlord Community",
      subtitle:"You're not alone in this.",
      body:"Connect with verified landlords in your city. Ask questions about leases, repairs, tenant screening, and pricing — real answers from people who've been through it.",
      highlight:"Go to My Property → Landlord Community",
      cta:"Let's go →",
    },
  ],
  management: [
    {
      icon:"🏢",
      title:"Welcome to Chathouse",
      subtitle:"Your portfolio. Your reputation.",
      body:"Chathouse is where renters research their next home and read what past tenants say about buildings like yours. Your account gives you the tools to respond, manage, and lead.",
      highlight:null,
      cta:"Let's go →",
    },
    {
      icon:"✓",
      title:"Claim your properties",
      subtitle:"Verify once. Respond forever.",
      body:"Claim each building in your portfolio with a management contract or business license. Once verified you can respond officially to any comment on that listing.",
      highlight:"Go to Property Dashboard → Claim New Listing",
      cta:"Got it →",
    },
    {
      icon:"🏢",
      title:"Official responses",
      subtitle:"Turn criticism into credibility.",
      body:"Every comment on your claimed listings gets a response input. Your reply posts with a distinct 🏢 Official Response badge. Prospective tenants read your responses — make them count.",
      highlight:"Management-relevant comments are flagged in red for you",
      cta:"Got it →",
    },
    {
      icon:"📊",
      title:"Portfolio sentiment",
      subtitle:"Know how tenants really feel.",
      body:"Your dashboard shows a sentiment score per building based on comment tone. Track trends over time and see which properties need attention before problems escalate.",
      highlight:"Check the Portfolio Sentiment section in your dashboard",
      cta:"Got it →",
    },
    {
      icon:"⚡",
      title:"You're all set",
      subtitle:"Your portfolio dashboard is ready.",
      body:"Claim your listings, respond to comments, and track sentiment across your portfolio. The community is watching — show them what great management looks like.",
      highlight:null,
      cta:"Go to my dashboard →",
    },
  ],
};

function Onboarding({ user, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const accountType = user.accountType==="landlord" ? "landlord" : user.accountType==="management" ? "management" : user.accountType==="agent" ? "agent" : user.accountType==="broker" ? "broker" : "buyer";
  const steps = ONBOARDING_STEPS[accountType] || ONBOARDING_STEPS.buyer;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const accentColor = {
    buyer:"#2563eb", agent:"#16a34a", broker:"#7c3aed",
    landlord:"#ea580c", management:"#dc2626"
  }[accountType] || "#2563eb";

  const bgGradient = {
    buyer:"linear-gradient(135deg,#eff6ff,#dbeafe)",
    agent:"linear-gradient(135deg,#f0fdf4,#dcfce7)",
    broker:"linear-gradient(135deg,#f5f3ff,#ede9fe)",
    landlord:"linear-gradient(135deg,#fff7ed,#ffedd5)",
    management:"linear-gradient(135deg,#fef2f2,#fee2e2)",
  }[accountType];

  return (
    <div style={{ maxWidth:680, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      {/* Progress bar */}
      <div style={{ display:"flex", gap:6, marginBottom:32 }}>
        {steps.map((_,i) => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=step ? accentColor : "#e2e8f0", transition:"background 0.3s" }}/>
        ))}
      </div>

      {/* Card */}
      <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e8eaed", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
        {/* Hero */}
        <div style={{ background:bgGradient, padding:"40px 40px 32px", textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>{current.icon}</div>
          <div style={{ fontSize:24, fontWeight:800, color:"#1a202c", fontFamily:serif, marginBottom:6 }}>{current.title}</div>
          <div style={{ fontSize:15, color:accentColor, fontWeight:600, fontFamily:ff }}>{current.subtitle}</div>
        </div>

        {/* Body */}
        <div style={{ padding:"28px 40px 32px" }}>
          <p style={{ fontSize:15, color:"#475569", lineHeight:1.75, fontFamily:ff, marginBottom: current.highlight ? 20 : 28, textAlign:"center" }}>
            {current.body}
          </p>

          {/* Highlight tip */}
          {current.highlight && (
            <div style={{ background:"#f8fafc", border:`1.5px solid ${accentColor}30`, borderRadius:12, padding:"12px 16px", marginBottom:28, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>💡</span>
              <span style={{ fontSize:13, color:"#475569", fontFamily:ff, fontWeight:500 }}>{current.highlight}</span>
            </div>
          )}

          {/* Step counter */}
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <span style={{ fontSize:12, color:"#94a3b8", fontFamily:ff }}>{step+1} of {steps.length}</span>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button onClick={() => isLast ? onComplete() : setStep(s=>s+1)}
              style={{ background:accentColor, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:ff, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.target.style.opacity="0.9"}
              onMouseLeave={e=>e.target.style.opacity="1"}>
              {current.cta}
            </button>
            {step > 0 && (
              <button onClick={() => setStep(s=>s-1)} style={{ background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:12, padding:"12px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:ff }}>
                ← Back
              </button>
            )}
            <button onClick={onSkip} style={{ background:"none", color:"#94a3b8", border:"none", padding:"8px", fontSize:13, cursor:"pointer", fontFamily:ff }}>
              Skip for now — I'll explore on my own
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Chathouse() {
  const [tab, setTab] = useState("feed");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [openL, setOpenL] = useState(null);
  const [saved, setSaved] = useState([]);
  const [user, setUser] = useState(null);
  const [pendingConnects, setPendingConnects] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [activeConvo, setActiveConvo] = useState(null);
  const [conversations, setConversations] = useState([
    { id:1, with:{ name:"Sandra Lee", av:"S", accountType:"agent", badge:"🤝 Agent" }, lastMsg:"Of course Tyrese — I just sent you a request!", time:"18h ago", unread:1, messages:[
      { id:1, from:"Sandra Lee", av:"S", text:"Hi! I saw you've been exploring Harlem listings on Chathouse. I specialize in that area — happy to answer any questions!", time:"2 days ago", mine:false },
      { id:2, from:"Me", av:"M", text:"Thanks Sandra! I've been really impressed with your updates on the platform. Do you work with first-time buyers?", time:"2 days ago", mine:true },
      { id:3, from:"Sandra Lee", av:"S", text:"Absolutely — first-time buyers are actually my specialty. I love walking people through the whole process. Want to set up a quick call?", time:"1 day ago", mine:false },
      { id:4, from:"Me", av:"M", text:"Yes that would be amazing. I've been looking at 2BR options in Harlem and Washington Heights.", time:"1 day ago", mine:true },
      { id:5, from:"Sandra Lee", av:"S", text:"Of course Tyrese — I just sent you a request!", time:"18h ago", mine:false },
    ]},
    { id:2, with:{ name:"Lena K.", av:"L", accountType:"buyer", badge:null }, lastMsg:"Right? The light in that unit was incredible.", time:"3 days ago", unread:0, messages:[
      { id:1, from:"Lena K.", av:"L", text:"Hey! I saw you also commented on 142 Montague St in Brooklyn Heights. Did you end up touring it?", time:"4 days ago", mine:false },
      { id:2, from:"Me", av:"M", text:"Not yet! I've been on the fence. The price seems fair but I'm not sure about the commute from there.", time:"4 days ago", mine:true },
      { id:3, from:"Lena K.", av:"L", text:"I actually toured it last week. The apartment is gorgeous but you're right — the commute to midtown is about 40 mins on the 2/3.", time:"3 days ago", mine:false },
      { id:4, from:"Me", av:"M", text:"That's super helpful thank you! Did you like the building overall?", time:"3 days ago", mine:true },
      { id:5, from:"Lena K.", av:"L", text:"Right? The light in that unit was incredible.", time:"3 days ago", mine:false },
    ]},
    { id:3, with:{ name:"Robert Chen", av:"R", accountType:"broker", badge:"🏦 Broker" }, lastMsg:"I can have your pre-approval done in 48 hours.", time:"5 days ago", unread:0, messages:[
      { id:1, from:"Robert Chen", av:"R", text:"Hi Marcus — I noticed you're actively searching for a home in NYC. I'm a mortgage broker at Chase and wanted to reach out. Are you pre-approved yet?", time:"6 days ago", mine:false },
      { id:2, from:"Me", av:"M", text:"Not yet — it's been on my to-do list. How long does the process take?", time:"6 days ago", mine:true },
      { id:3, from:"Robert Chen", av:"R", text:"For most buyers it takes about 2–3 business days. I'll need your last 2 years of tax returns, recent pay stubs, and bank statements.", time:"5 days ago", mine:false },
      { id:4, from:"Me", av:"M", text:"That's not too bad. What's your rate looking like right now?", time:"5 days ago", mine:true },
      { id:5, from:"Robert Chen", av:"R", text:"I can have your pre-approval done in 48 hours.", time:"5 days ago", mine:false },
    ]},
  ]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [toast, setToast] = useState(null);
  const [notifs, setNotifs] = useState([
    {id:1,icon:"🏠",title:"New listing in NYC",body:"310 W 85th St just listed at $3,200/mo — Upper West Side",time:"2m ago",read:false},
    {id:2,icon:"⚠️",title:"Landlord alert in Williamsburg",body:"Tenants flagged heating issues at 57 Driggs Ave",time:"15m ago",read:false},
    {id:3,icon:"🔥",title:"Price drop alert!",body:"893 Coastal Ridge Blvd in Tampa dropped $15k",time:"1h ago",read:true},
  ]);

  const unread = notifs.filter(n=>!n.read).length;
  const isPro = user && (user.accountType==="agent" || user.accountType==="broker");
  const isMgmt = user && user.accountType==="management";
  const isLandlord = user && user.accountType==="landlord";

  const push = n => {
    setNotifs(p => [{ id:Date.now(), ...n, time:"Just now", read:false }, ...p]);
    setToast(n);
  };

  useEffect(() => {
    const t = setTimeout(() => push({ icon:"🏢", title:"New rental just listed!", body:"415 Edgecombe Ave in Harlem — $1,950/mo. Best value in Manhattan." }), 9000);
    return () => clearTimeout(t);
  }, []);

  const handleSave = id => { if(!user){setShowAuth(true);return;} setSaved(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); };
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);
  const [showOnboardingReminder, setShowOnboardingReminder] = useState(false);

  const handleAuth = u => {
    setUser(u);
    setShowAuth(false);
    // Only show onboarding for new signups (not demo logins)
    const isDemo = Object.values(DEMO_ACCOUNTS).some(d => d.email === u.email);
    if (!isDemo) setShowOnboarding(true);
  };
  const guestUser = { name:"Guest", av:"G" };

  const lists = LISTINGS
    .filter(l => city==="All Cities" || l.city===city)
    .filter(l => typeFilter==="All" || (typeFilter==="For Sale"&&l.type==="sale") || (typeFilter==="For Rent"&&l.type==="rent"))
    .filter(l => !search || [l.address,l.city,l.hood].some(s=>s.toLowerCase().includes(search.toLowerCase())))
    .filter(l => tab==="saved" ? saved.includes(l.id) : true)
    .sort((a,b) => {
      if (tab==="trending"||sort==="Most Liked") return b.likes-a.likes;
      if (sort==="Price: Low→High") return a.price-b.price;
      if (sort==="Price: High→Low") return b.price-a.price;
      return a.daysAgo-b.daysAgo;
    });

  const closeDropdowns = () => { setShowNotifs(false); setShowProfile(false); setShowInbox(false); };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:"100vh", background:"#f4f6f9" }}>

        {/* NAVBAR */}
        <nav style={{ background:"#fff", borderBottom:"1px solid #e8eaed", position:"sticky", top:0, zIndex:200, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", height:58, gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              <div style={{ width:34, height:34, background:"#2563eb", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏠</div>
              <span style={{ fontSize:20, fontWeight:800, color:"#1a202c", fontFamily:serif, letterSpacing:-0.5 }}>Chathouse</span>
            </div>
            <div style={{ flex:1, maxWidth:400, position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search address, city, or neighborhood..." style={{ width:"100%", padding:"8px 14px 8px 35px", borderRadius:10, border:"1.5px solid #e8eaed", background:"#f8fafc", fontSize:13, color:"#1a202c", outline:"none", fontFamily:ff }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:"auto" }}>
              <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:3, gap:2 }}>
                {[{v:"grid",i:"⊞"},{v:"map",i:"🗺️"}].map(({v,i}) => (
                  <button key={v} onClick={() => setView(v)} style={{ border:"none", background:view===v?"#fff":"transparent", borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:14, boxShadow:view===v?"0 1px 3px rgba(0,0,0,0.1)":"none", transition:"all 0.2s" }}>{i}</button>
                ))}
              </div>
              <div style={{ position:"relative" }}>
                <button onClick={() => { setShowNotifs(o=>!o); setShowProfile(false); setShowInbox(false); }} style={{ border:"none", background:"#f1f5f9", borderRadius:10, width:37, height:37, cursor:"pointer", fontSize:16, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  🔔
                  {unread>0 && <span style={{ position:"absolute", top:5, right:5, width:14, height:14, background:"#dc2626", borderRadius:"50%", fontSize:8, color:"#fff", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>{unread}</span>}
                </button>
                {showNotifs && <NotifPanel notifs={notifs} onClear={() => setNotifs(p=>p.map(n=>({...n,read:true})))}/>}
              </div>
              {user && (
                <div style={{ position:"relative" }}>
                  <button onClick={() => { setShowInbox(o=>!o); setShowNotifs(false); setShowProfile(false); }} style={{ border:"none", background:"#f1f5f9", borderRadius:10, width:37, height:37, cursor:"pointer", fontSize:16, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    💬
                    {conversations.some(c=>c.unread>0) && <span style={{ position:"absolute", top:5, right:5, width:14, height:14, background:"#2563eb", borderRadius:"50%", fontSize:8, color:"#fff", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>{conversations.reduce((s,c)=>s+c.unread,0)}</span>}
                  </button>
                  {showInbox && (
                    <div style={{ position:"absolute", top:50, right:0, width:340, background:"#fff", border:"1.5px solid #e8eaed", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,0.13)", zIndex:500, overflow:"hidden" }}>
                      <div style={{ padding:"13px 18px 9px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontWeight:700, fontSize:14, color:"#1a202c", fontFamily:ff }}>Messages</span>
                        <button onClick={() => { setActiveConvo(null); setShowInbox(false); }} style={{ border:"none", background:"none", fontSize:13, color:"#94a3b8", cursor:"pointer", fontFamily:ff }}>✕</button>
                      </div>
                      <div style={{ maxHeight:380, overflowY:"auto" }}>
                        {conversations.map(c => (
                          <div key={c.id} onClick={() => { setActiveConvo(c.id); setShowInbox(false); setConversations(p => p.map(x => x.id===c.id ? {...x,unread:0} : x)); }}
                            style={{ padding:"12px 18px", borderBottom:"1px solid #f8fafc", display:"flex", gap:10, cursor:"pointer", background:c.unread>0?"#f8fafc":"#fff", transition:"background 0.15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"}
                            onMouseLeave={e=>e.currentTarget.style.background=c.unread>0?"#f8fafc":"#fff"}>
                            <div style={{ position:"relative", flexShrink:0 }}>
                              <Av letter={c.with.av} size={40}/>
                              {c.with.badge && <span style={{ position:"absolute", bottom:-2, right:-2, fontSize:10, background:"#fff", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #e8eaed" }}>{c.with.badge.split(" ")[0]}</span>}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                                <span style={{ fontSize:13, fontWeight:700, color:"#1a202c", fontFamily:ff }}>{c.with.name}</span>
                                <span style={{ fontSize:10, color:"#94a3b8", fontFamily:ff }}>{c.time}</span>
                              </div>
                              <div style={{ fontSize:12, color:"#64748b", fontFamily:ff, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.lastMsg}</div>
                            </div>
                            {c.unread>0 && <div style={{ width:18, height:18, background:"#2563eb", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700, flexShrink:0 }}>{c.unread}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {user ? (
                <div style={{ position:"relative" }}>
                  <button onClick={() => { setShowProfile(o=>!o); setShowNotifs(false); }} style={{ display:"flex", alignItems:"center", gap:8, border:"1.5px solid #e8eaed", borderRadius:10, padding:"4px 12px 4px 5px", cursor:"pointer", background:"#fff" }}>
                    {user.photoPreview
                      ? <img src={user.photoPreview} alt="" style={{ width:26, height:26, borderRadius:"50%", objectFit:"cover" }}/>
                      : <Av letter={user.av} size={26}/>
                    }
                    <span style={{ fontSize:13, fontWeight:600, color:"#475569", fontFamily:ff }}>{user.name.split(" ")[0]}</span>
                    {isPro && <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background: user.accountType==="broker"?"#f5f3ff":"#f0fdf4", color:user.accountType==="broker"?"#7c3aed":"#16a34a", fontFamily:ff }}>{user.accountType==="broker"?"Broker":"Agent"}</span>}
                    {isMgmt && <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:"#fef2f2", color:"#dc2626", fontFamily:ff }}>Manager</span>}
                    {isLandlord && <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:"#fff7ed", color:"#ea580c", fontFamily:ff }}>Landlord</span>}
                  </button>
                  {showProfile && <ProfileMenu user={user} savedCount={saved.length} onLogout={() => { setUser(null); setShowProfile(false); }}/>}
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:10, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:ff }}>Sign In</button>
              )}
            </div>
          </div>

          {/* TABS */}
          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 20px", display:"flex", gap:2, borderTop:"1px solid #f1f5f9" }}>
            {[
              {k:"feed",l:"🏘️ Live Feed"},
              {k:"trending",l:"🔥 Trending"},
              {k:"saved",l:`🔖 Saved${saved.length?" ("+saved.length+")":""}`},
              {k:"news",l:"📰 News"},
              {k:"calculator",l:"🧮 Calculator"},
              ...(user ? [{k:"myprofile",l:"👤 My Profile"}] : []),
              ...(user?.accountType==="agent" ? [
                {k:"leads",l:"🔍 Buyer Leads"},
                {k:"dashboard",l:"📊 Agent Dashboard"},
              ] : []),
              ...(user?.accountType==="broker" ? [
                {k:"dashboard",l:"📊 Broker Dashboard"},
              ] : []),
              ...(user?.accountType==="management" ? [
                {k:"dashboard",l:"📊 Property Dashboard"},
              ] : []),
              ...(user?.accountType==="landlord" ? [
                {k:"dashboard",l:"🏡 My Property"},
              ] : []),
            ].map(({k,l}) => (
              <button key={k} onClick={() => setTab(k)} style={{ border:"none", background:"transparent", padding:"9px 16px", fontSize:13, fontWeight:600, cursor:"pointer", color:tab===k?(user?.accountType==="broker"?"#7c3aed":"#16a34a"):"#64748b", borderBottom:tab===k?`2.5px solid ${user?.accountType==="broker"?"#7c3aed":"#16a34a"}`:"2.5px solid transparent", transition:"all 0.15s", fontFamily:ff }}>{l}</button>
            ))}
          </div>
        </nav>

        {/* FILTERS — hidden on pro tabs and profile */}
        {tab!=="dashboard" && tab!=="leads" && tab!=="myprofile" && tab!=="news" && tab!=="calculator" && !(tab==="dashboard" && isMgmt) && !(tab==="dashboard" && isLandlord) && (
        <div style={{ background:"#fff", borderBottom:"1px solid #e8eaed" }}>
          <div style={{ maxWidth:1160, margin:"0 auto", padding:"10px 20px", display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff }}>Type:</span>
            {TYPES.map(t => <Chip key={t} active={typeFilter===t} onClick={() => setTypeFilter(t)}>{t==="For Sale"?"🏠 For Sale":t==="For Rent"?"🏢 For Rent":"🏘️ All"}</Chip>)}
            <div style={{ width:1, height:18, background:"#e8eaed", margin:"0 4px" }}/>
            <span style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.8, fontFamily:ff }}>City:</span>
            {CITIES.map(c => <Chip key={c} active={city===c} onClick={() => setCity(c)}>{c}</Chip>)}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600, fontFamily:ff }}>Sort:</span>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{ border:"1.5px solid #e8eaed", borderRadius:8, padding:"5px 10px", fontSize:12, color:"#475569", background:"#fff", outline:"none", fontFamily:ff }}>
                {SORTS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        )}

        {/* MAIN */}
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"24px 20px" }}>

          {/* ONBOARDING — replaces content inline */}
          {showOnboarding && user && (
            <Onboarding
              user={user}
              onComplete={() => { setShowOnboarding(false); setOnboardingSkipped(false); }}
              onSkip={() => { setShowOnboarding(false); setOnboardingSkipped(true); setShowOnboardingReminder(true); setTimeout(() => setShowOnboardingReminder(false), 8000); }}
            />
          )}

          {/* Onboarding reminder banner */}
          {!showOnboarding && onboardingSkipped && showOnboardingReminder && (
            <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1.5px solid #bfdbfe", borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12, animation:"fadeUp 0.3s ease" }}>
              <span style={{ fontSize:18 }}>👋</span>
              <p style={{ flex:1, fontSize:13, color:"#1e40af", fontFamily:ff }}>Whenever you're ready — <strong>finish your quick setup</strong> to get the most out of Chathouse.</p>
              <button onClick={() => { setShowOnboarding(true); setShowOnboardingReminder(false); }} style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:ff }}>Resume →</button>
              <button onClick={() => setShowOnboardingReminder(false)} style={{ border:"none", background:"none", fontSize:13, color:"#94a3b8", cursor:"pointer" }}>✕</button>
            </div>
          )}

          {/* Regular content — hidden during onboarding */}
          {!showOnboarding && (<>

          {/* MY PROFILE TAB */}
          {tab==="myprofile" && user ? (
            <MyProfile user={user} onUpdateUser={setUser} isPro={isPro} pendingConnects={pendingConnects}/>
          ) : tab==="news" ? (
            <NewsFeed/>
          ) : tab==="calculator" ? (
            <PaymentCalculator/>
          ) : tab==="dashboard" && isPro ? (
            user.accountType==="agent"
              ? <AgentDashboard user={user}/>
              : <BrokerDashboard user={user}/>
          ) : tab==="dashboard" && isMgmt ? (
            <ManagementDashboard user={user} listings={LISTINGS} onOpenListing={setOpenL}/>
          ) : tab==="dashboard" && isLandlord ? (
            <ManagementDashboard user={user} listings={LISTINGS} onOpenListing={setOpenL}/>
          ) : tab==="leads" && isPro ? (
            <BrokerLeadFeed user={user}/>
          ) : (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:12 }}>
                <div>
                  <span style={{ fontSize:22, fontWeight:800, color:"#1a202c", fontFamily:serif }}>
                    {tab==="feed"?"Live Listings":tab==="trending"?"🔥 Trending Now":"🔖 Saved"}
                  </span>
                  <span style={{ fontSize:13, color:"#94a3b8", marginLeft:10, fontFamily:ff }}>{lists.length} listings</span>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  {[{icon:"🏠",label:"For Sale",val:LISTINGS.filter(l=>l.type==="sale").length},{icon:"🏢",label:"For Rent",val:LISTINGS.filter(l=>l.type==="rent").length},{icon:"💬",label:"Comments",val:notifs.length+89}].map(({icon,label,val}) => (
                    <div key={label} style={{ textAlign:"center", background:"#fff", padding:"7px 14px", borderRadius:12, border:"1px solid #e8eaed" }}>
                      <div style={{ fontSize:11, color:"#94a3b8", fontFamily:ff }}>{icon} {label}</div>
                      <div style={{ fontSize:15, fontWeight:800, color:"#1a202c", fontFamily:serif }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:"1.5px solid #bfdbfe", borderRadius:14, padding:"11px 18px", display:"flex", alignItems:"center", gap:10, marginBottom: (user && !isPro && !isMgmt && !isLandlord && (typeFilter!=="All" || city!=="All Cities")) ? 10 : 22 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite", flexShrink:0 }}/>
                <span style={{ fontSize:13, color:"#1e40af", fontFamily:ff }}><strong>Auto-syncing</strong> for-sale and rental listings from the top housing platforms every 15 minutes — no agents or landlords required.</span>
                <span style={{ marginLeft:"auto", fontSize:11, color:"#22c55e", fontWeight:700, fontFamily:ff, animation:"blink 2s infinite" }}>● LIVE</span>
              </div>

              {/* Save search as alert prompt */}
              {user && !isPro && !isMgmt && !isLandlord && (typeFilter!=="All" || city!=="All Cities") && tab==="feed" && (
                <div style={{ background:"#fffbeb", border:"1.5px solid #fde68a", borderRadius:12, padding:"10px 16px", marginBottom:22, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:16 }}>🔔</span>
                  <p style={{ flex:1, fontSize:13, color:"#92400e", fontFamily:ff }}>
                    You're viewing <strong>{typeFilter!=="All"?typeFilter:"listings"}{city!=="All Cities"?` in ${city.split(",")[0]}`:""}</strong> — want to be notified when new ones hit?
                  </p>
                  <button onClick={() => setTab("myprofile")} style={{ background:"#f59e0b", color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:ff, whiteSpace:"nowrap" }}>
                    Save as Alert →
                  </button>
                </div>
              )}

              {view==="map" && <MapView listings={lists} onOpen={setOpenL}/>}

              {tab==="saved" && saved.length===0 ? (
                <div style={{ textAlign:"center", padding:"80px 20px" }}>
                  <div style={{ fontSize:52, marginBottom:16 }}>🔖</div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#475569", marginBottom:8, fontFamily:ff }}>No saved listings yet</div>
                  <div style={{ fontSize:14, color:"#94a3b8", fontFamily:ff }}>Tap 🔖 on any listing to save it here.</div>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))", gap:20 }}>
                  {lists.map(l => <Card key={l.id} listing={l} onOpen={setOpenL} saved={saved.includes(l.id)} onSave={handleSave}/>)}
                </div>
              )}
            </>
          )}
          </>)}
        </div>
      </div>

      {openL && <Drawer listing={openL} user={user||guestUser} saved={saved.includes(openL.id)} onSave={() => handleSave(openL.id)} onClose={() => setOpenL(null)}
        onConnect={profile => {
          setPendingConnects(p => p.find(x => x.id===profile.id) ? p : [...p, profile]);
          push({ icon:"👋", title:"Connection request sent!", body:`You sent a connect request to ${profile.name} from this listing.` });
        }}
      />}
      {showAuth && <AuthModal onAuth={handleAuth} onClose={() => setShowAuth(false)}/>}
      {toast && <Toast n={toast} onDismiss={() => setToast(null)}/>}
      {(showNotifs||showProfile||showInbox) && <div style={{ position:"fixed", inset:0, zIndex:199 }} onClick={closeDropdowns}/>}

      {/* CONVERSATION THREAD */}
      {activeConvo && user && (() => {
        const convo = conversations.find(c => c.id===activeConvo);
        if (!convo) return null;
        return (
          <ConversationThread
            convo={convo}
            user={user}
            listings={LISTINGS}
            onClose={() => setActiveConvo(null)}
            onSend={(text, sharedListing) => {
              setConversations(p => p.map(c => c.id===activeConvo
                ? {...c, lastMsg:sharedListing?"📎 Shared a listing":text, time:"Just now"}
                : c
              ));
            }}
          />
        );
      })()}
    </>
  );
}
