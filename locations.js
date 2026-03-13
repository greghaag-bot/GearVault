/* ============================================
   GearVault — Location Scouting Module
   ============================================ */

(function () {
  "use strict";

  // ---- State ----
  let locations = [];
  let locIdCounter = 1;
  let expandedLocationId = null;
  let activeRegionFilter = "all";

  // ---- US Regions (default grouping) ----
  const REGIONS = [
    "Southwest",
    "Pacific Northwest",
    "Rocky Mountains",
    "Southeast",
    "Northeast",
    "Midwest",
    "West Coast",
    "Hawaii",
    "Alaska",
    "International",
    "Other"
  ];

  // ---- Default Locations (56 from Photographer's Trail Notes) ----
  const DEFAULT_LOCATIONS = [
    {
      name: "Alien Throne",
      nearbyTown: "Farmington and Bloomfield, New Mexico",
      state: "New Mexico (NM)",
      region: "Southwest",
      lat: "36.14885",
      lng: "-107.98075",
      elevation: "Approximately 6,150 to 6,250 feet (1,875-1,905 meters)",
      trailDifficulty: "Rated 2 to 3 out of 5 or Moderate to Challenging. While the hike is relatively short (~1.5 miles each way), there are no marked trails, requiring cross-country navigation through badlands and washes",
      bestTimeOfDay: "The best time to shoot Alien Throne is at sunset, as the sun sets behind the formation, or at night for Milky Way photography, with the galactic center often rising towards the formation. Sunrise is also recommended for nearby hoodoos, though some bluffs may block early light",
      bestTimeOfYear: "September and October are considered prime months due to hospitable temperatures (49\u00b0-76\u00b0F). Spring (April/May) is also good but can be very windy with fine dust. Winter offers unique snow shots but is very cold at 6,500 feet",
      photographyTips: "Get low to the ground to make the formation fill the foreground. Use focus stacking for maximum depth of field. For night photography, arrive early to scout and pre-focus. The formation is hidden until you are close, so use GPS to avoid missing it. Contrast between light sandstone and blue skies makes it a great subject for black and white photography",
      shotDirection: "The best light for the primary composition is at sunset, with the camera facing roughly West/Northwest as the sun sets behind the formation. For Milky Way shots, photographers typically face South or Southwest to capture the galactic center rising over the spire",
      lensesNeeded: "Wide to ultra-wide-angle lenses are recommended; typical focal lengths used are 14mm to 24mm for full-frame cameras to capture the formation and the sky. An 85mm lens has also been used to capture specific compositions",
      equipmentNeeded: "A tripod is critical for depth of field and night shots. A polarizer helps intensify blue skies. GPS navigation (smartphone app or handheld) is essential to find the specific formation in the featureless badlands. Bring plenty of water as there is no shade or water source",
      permits: "No fees or permits are required for hiking in the Valley of Dreams or the adjacent Ah-Shi-Sle-Pah Wilderness Study Area, which is open 24/7. However, the parking area may be on private or Navajo tribal land, so visitors should remain on established dirt roads and respect the area",
      directions: "From Farmington, NM, drive south on NM-371. Turn left onto CR-7650 for 7.8 miles, then right on CR-7870. Follow for 8.3 miles to a sharp left on an unmarked dirt road leading to the Valley of Dreams Trailhead. High-clearance 4WD vehicles can continue past a livestock pen to a closer parking area. From the parking, hike ~1.5 miles north-northwest through the badlands to locate the formation",
      camping: "Bisti/De-Na-Zin Wilderness (dispersed camping), Valley of Dreams Trailhead (parking area used by campers), and Ah-Shi-Sle-Pah Wilderness Study Area",
      lodging: "Hotels are available in Farmington, NM and Bloomfield, NM",
      restaurants: "Dining options are located in Farmington and Bloomfield, NM",
      cellService: "Cell service is lacking or spotty in this remote part of New Mexico; visitors are advised to download maps and GPS coordinates before leaving Farmington",
      weather: "The climate is arid desert. Summers are brutal with temperatures exceeding 90\u00b0F and no shade. Monsoons in late summer can bring dramatic clouds but also dangerous flash floods that turn the clay soil into impassable \"death mud.\" Winters are cold and can see snow",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/alien-throne",
      photos: []
    },
    {
      name: "Alstrom Point",
      nearbyTown: "Big Water (UT) and Page (AZ) (Photographers Trail Notes, Red Around the World)",
      state: "Utah (located on the UT/AZ border) (Red Around the World)",
      region: "Southwest",
      lat: "37.059099",
      lng: "-111.364248",
      elevation: "4,690 Ft (Photographers Trail Notes)",
      trailDifficulty: "5/5 (Difficult to Extreme). The road is rough, and the final section involves steep, rocky slickrock climbs (Photographers Trail Notes)",
      bestTimeOfDay: "Sunset and sunrise are both exceptional, though sunset is often preferred for the warm light illuminating the red buttes and Padre Bay (Photographers Trail Notes, Action Photo Tours)",
      bestTimeOfYear: "Spring (March\u2013May) and Fall (September\u2013November) are the ideal times due to comfortable temperatures and dramatic light (Action Photo Tours, Stratus Adventure Photography). Summer can be extremely hot, and winter may bring difficult road conditions (Brendan van Son Photography)",
      photographyTips: "Walk the rim to find a foreground anchor (like a rock formation) to add depth to the wide vista. The scene is best captured as a panorama to encompass the scale of Lake Powell and Gunsight Butte. Watch for dramatic light \"pockets\" on the distant mesas (Photographers Trail Notes, Action Photo Tours)",
      shotDirection: "The primary view looks South/Southeast towards Padre Bay and Gunsight Butte (Action Photo Tours, Dreamland Safari Tours)",
      lensesNeeded: "Wide-angle lenses are primary for the grand vista; panoramic equipment is highly recommended (Photographers Trail Notes). Telephoto lenses are also useful for capturing pockets of light on distant cliffs (Action Photo Tours)",
      equipmentNeeded: "High-clearance 4x4 vehicle (essential), sturdy tripod, panoramic head, tire pressure gauge, and plenty of water/supplies (Photographers Trail Notes, The Wanderer's Guide)",
      permits: "No specific permits are required for the viewpoint, though Glen Canyon National Recreation Area entrance fees may apply (The Wanderer's Guide)",
      directions: "From Big Water, UT, take Smoky Mountain Road (NP 230) for approximately 14 miles. Veer right to stay on NP 230 for another 4.7 miles, then turn right onto NP 264. Follow this for 5.8 miles to the point (The Wanderer's Guide). The final 2 miles are extremely rocky and require high-clearance 4x4 (Photographers Trail Notes)",
      camping: "Dispersed camping is permitted at Alstrom Point; there are no developed campgrounds (Red Around the World, The Wanderer's Guide)",
      lodging: "Nearby options in Page, AZ include Country Inn & Suites, La Quinta Inn & Suites, and Hampton Inn (Tripadvisor). Under Canvas Lake Powell - Grand Staircase is located near Big Water, UT (Google Search)",
      restaurants: "Nearby dining in Page, AZ includes BirdHouse, Beaver Taco, Red Heritage, and Sunset 89 (Yelp)",
      cellService: "Cell service is generally unreliable and spotty throughout the area (National Park Service)",
      weather: "Typical desert climate: hot summers and cold winters. Roads become impassable when wet due to bentonite clay and deep sand; avoid travel if rain is forecasted (National Park Service, Red Around the World)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/alstrom-point",
      photos: []
    },
    {
      name: "Archangel Falls",
      nearbyTown: "Springdale / Virgin",
      state: "Utah (UT)",
      region: "Southwest",
      lat: "37.308994",
      lng: "-113.055317",
      elevation: "5,280 ft (Photographers Trail Notes)",
      trailDifficulty: "4.5 / 5 (Hard). The 8\u20139 mile roundtrip hike is strenuous, involving steep descents/ascents, boulder hopping, and multiple creek crossings. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      bestTimeOfDay: "Early to mid-morning, typically 3-4 hours after sunrise (e.g., around 10:45 AM in early November). It is best when there is a red glow on the back wall but before direct sunlight hits the falls, which occurs later in the day. (Photographers Trail Notes)",
      bestTimeOfYear: "Great year-round, but the peak time is the last week of October to the first week of November for autumn foliage (yellows, golds, and reds). (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      photographyTips: "Focus on capturing the water flow against the cascading crimson steps and the red glow of the Navajo sandstone back wall. Use a slow shutter speed (1/2 second or longer) for silky water effects. Arrive early to explore multiple angles and compositions before other photographers arrive. (Photographers Trail Notes) (MishMoments)",
      shotDirection: "North by Northeast @ 65\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "24mm focal length is popular; a 16-35mm wide-angle lens is recommended to cover Archangel Falls, the Crack, and the Subway. (Photographers Trail Notes)",
      equipmentNeeded: "Tripod, polarizer, neutral density filter, waders or wet shoes (Neoprene socks), walking stick or trekking poles, and potentially a small broom to sweep sand off the falls. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      permits: "An NPS Wilderness Permit is strictly required for the Left Fork North Creek (Subway) hike. Permits are limited to 80 per day and are distributed via an online lottery (2 months in advance), a secondary online calendar (1 month in advance), or a last-minute walk-in process. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      directions: "From Springdale, UT, take UT 9 west for 12 miles to Virgin. Turn right onto Camino Del Rio (becomes Kolob Terrace Rd) and drive 9 miles to the Left Fork trailhead. Hike 0.5 miles northeast to the canyon rim, descend 500 feet to the creek, and then hike approximately 3 miles upstream. Archangel Falls is the second major set of red cascading falls you encounter, distinguished by a towering red wall on the right. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      camping: "South Campground, Watchman Campground, Zion River Resort. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      lodging: "Desert Pearl Inn, Cable Mountain Lodge, Hampton Inn & Suites Springdale, My Place (Hurricane), Zion Lodge. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      restaurants: "The Spotted Dog, Oscar's Cafe, Cafe Soleil. (Photographers Trail Notes)",
      cellService: "No cell service is available once you descend into the canyon for the hike. A satellite communicator like a Garmin Inreach is recommended for emergencies. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      weather: "Zion experiences extreme temperatures ranging from 100\u00b0F+ in summer to below freezing in winter. Flash floods are a severe and potentially deadly risk; always check the weather forecast and river levels before starting. (Photographers Trail Notes) (BEST TIME 2 TRAVEL)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/archangel-falls",
      photos: []
    },
    {
      name: "Balanced Rock (Photographers Trail Notes)",
      nearbyTown: "Moab, UT (Photographers Trail Notes)",
      state: "Utah (Photographers Trail Notes)",
      region: "Southwest",
      lat: "38.701542",
      lng: "-109.566583",
      elevation: "5,039 ft (Photographers Trail Notes)",
      trailDifficulty: "1 on a 1-5 scale (Easy); the shot is taken just a few yards from the parking lot (Photographers Trail Notes)",
      bestTimeOfDay: "Late afternoon around sunset (Photographers Trail Notes). The late sun accentuates the red sandstone, and a few moments before sunset, the rocks transform into an \"unnatural glowing red\" (Photographers Trail Notes). Morning is also mentioned as a good time (Canyonlands Natural History Association)",
      bestTimeOfYear: "Great any time of year (Photographers Trail Notes). Fall and winter may offer snow on the La Sal Mountains in the background (Photographers Trail Notes)",
      photographyTips: "The shot is all about the \"brilliant red light\" on the red sandstone. A few moments before sunset, the soft rays transform the rocks into a glowing red. Use a polarizer to enhance this effect. The shape and profile of the rock change significantly depending on your standing position (Photographers Trail Notes)",
      shotDirection: "Mainly east @ 110\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "16mm to 70mm; the featured shot was taken with a 40mm lens (Photographers Trail Notes). A wide-angle lens works best for close-up vantage points (Canyonlands Natural History Association)",
      equipmentNeeded: "Tripod and a polarizer to enhance the red glow (Photographers Trail Notes)",
      permits: "Arches National Park entrance fee/admission; no additional special permits are required for this specific location once in the park (Photographers Trail Notes)",
      directions: "From Moab: Drive northwest on US 191 for approx. 4.5 miles, turn right onto Arches Entrance Rd. Pass the visitor's entrance and continue on Arches Scenic Dr. for 8.8 miles; the parking lot is on the right (Photographers Trail Notes)",
      camping: "Devils Garden Campground (only one in the park); there are also at least 10 other sites in and around Arches (Photographers Trail Notes)",
      lodging: "Gonzo Inn (Moab); Moab has an abundance of other lodging options (Photographers Trail Notes)",
      restaurants: "Gloria's, Bonjour Bakery, Red Rock Bakery & Net Cafe, Moab Diner, Dewey's, Antica Forma, Pasta Jay's, Horizon View Bar & Grill, Spitfire Smokehouse, Zak's, Desert Bistro, The Spoke, Broken Oar, The Sultan, and the Moab food truck park (Quesadilla Mobilla, Tacos El Gordo, Moab Kitchen) (Photographers Trail Notes)",
      cellService: "Limited/spotty service in Arches National Park with Verizon; signal is available once back at the highway (Photographers Trail Notes)",
      weather: "High desert climate with temperature swings of 30\u00b0-40\u00b0 per day. Summers can exceed 90\u00b0F. Monsoon season in late summer brings brief but violent thunderstorms (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/balanced-rock",
      photos: []
    },
    {
      name: "Bisti Badlands Wings (Stone Wings)",
      nearbyTown: "Farmington",
      state: "New Mexico",
      region: "Southwest",
      lat: "36.27908",
      lng: "-108.23733",
      elevation: "6,500 Ft. Photographers Trail Notes",
      trailDifficulty: "2/5 (Moderate) - The hike is a fairly easy 1-mile walk with little elevation gain, but navigation is difficult without a trail. Photographers Trail Notes",
      bestTimeOfDay: "Sunset is highly preferred for the warm glow it produces on the right side of the formations, though sunrise can also provide a nice sky. Photographers Trail Notes",
      bestTimeOfYear: "Spring to early summer is preferred for the angle of the sun, the position of the Milky Way, and modest temperatures. Photographers Trail Notes",
      photographyTips: "Position yourself on a modest hill to compose the shot. Sunset produces a beautiful orange glow on the formations. The area is also excellent for astrophotography (Milky Way and star trails) and light painting. Note that the iconic \"Klingon Battle Cruiser\" wing reportedly fell in March 2026. Photographers Trail Notes",
      shotDirection: "North by Northwest (approximately 330\u00b0). Photographers Trail Notes",
      lensesNeeded: "Lenses ranging from 16mm to 100mm; a 50mm lens was used for the primary featured shot. Photographers Trail Notes",
      equipmentNeeded: "Tripod, GPS unit or hiking app (e.g., Gala GPS), compass, headlamp (with red bulb for night shooting), backup flashlight, and plenty of water and snacks. Photographers Trail Notes",
      permits: "No permits required for the Bisti/De-Na-Zin Wilderness as of July 2019. Photographers Trail Notes",
      directions: "From Farmington, travel south on NM-371 for 33.5 miles. Turn left on Rd 7293 (look for the Bistahi Wilderness Church sign). After 1 mile, at the next cattle guard, turn right and then veer left for about 1/4 mile to reach the North Parking area. From there, hike approximately 1 mile east into the badlands using GPS coordinates. Photographers Trail Notes",
      camping: "BLM Land (Dispersed camping is allowed, but there are no designated campsites). Photographers Trail Notes",
      lodging: "Comfort Suites Farmington, Hampton Inn & Suites Farmington. Photographers Trail Notes",
      restaurants: "Francisca\u2019s, InfiniteBBQ, The Chile Pod. Photographers Trail Notes",
      cellService: "Spotty and inconsistent; there is no consistent cell service in the wilderness area. Photographers Trail Notes",
      weather: "High desert climate with temperature fluctuations of 30-40\u00b0 per day. Summers can exceed 90\u00b0F with no shade, while winters are very cold. Avoid the area after rain as the clay becomes extremely slippery. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/bisti-badlands-wings",
      photos: []
    },
    {
      name: "Bonsai Rock",
      nearbyTown: "Incline Village (NV) / New Washoe City (NV). Edin Chavez Photography, Fototripper",
      state: "Nevada (NV). Photographers Trail Notes",
      region: "Southwest",
      lat: "39.183690",
      lng: "-119.927088",
      elevation: "6,225 Ft. Photographers Trail Notes",
      trailDifficulty: "2/5 (Moderate). The trail is less than 1/4 mile long with a ~150 ft elevation drop, but is steep with loose sand and slippery rocks. Photographers Trail Notes, Edin Chavez Photography",
      bestTimeOfDay: "Sunset and Twilight (Blue Hour). The sky remains brighter than the foreground, often requiring multiple blended images. Arrive at least 45 minutes before sunset to scout compositions. Morning/Sunrise is also possible for calm, glassy water before the wind picks up. Photographers Trail Notes, Edin Chavez Photography, Boat Tahoe",
      bestTimeOfYear: "Fall and Winter (for side-lighting and snow on mountains); Summer (low tide exposes more white sand and rocks). Fototripper, Photographers Trail Notes",
      photographyTips: "Use long exposures (2-20 seconds) to flatten lake movement. Get low to the ground to make the rock stand out and separate it from the background mountains. Stay for the Blue Hour after sunset for the best light. Bracket exposures to handle the high dynamic range between the sky and shadows. A polarizer is a must to see through the clear turquoise water. Photographers Trail Notes, Edin Chavez Photography, Fototripper",
      shotDirection: "Mainly West (towards the sunset) or Northwest depending on the cove position. (Specific degrees often listed as ~270-300\u00b0 for sunset). Photographers Trail Notes Preview",
      lensesNeeded: "16-75mm (wide-angle to short telephoto). Wide-angle (14-24mm) is recommended for dramatic foregrounds, while 50mm is often used for the iconic rock silhouette. Photographers Trail Notes, Edin Chavez Photography",
      equipmentNeeded: "Tripod (essential for long exposures), Polarizer (to cut reflections and enhance water clarity), Neutral Density (ND) filters (0.9 or stronger for 2-20 second exposures), Graduated ND filter (3-stop soft-edge), Water-proof shoes/sandals (to get in the water for better angles), Flashlight/Headlamp (for sunset/blue hour hikes). Photographers Trail Notes, Fototripper, Edin Chavez Photography",
      permits: "None required for visiting the rock itself; however, parking fees may apply at nearby state parks like Sand Harbor. No reservation is required for the rock/shoreline area outside of State Park boundaries. Instagram, Facebook",
      directions: "Located on the northeast side of Lake Tahoe on NV-28. From Incline Village, drive south towards Sand Harbor State Park. Pass Sand Harbor and continue for about 1-2 miles. Look for pull-outs on the right (lakeside) immediately after a pull-out on the opposite side with a warning sign. Fototripper, Edin Chavez Photography",
      camping: "Sand Harbor State Park (nearby), Devils Garden (noted in site templates but specific to Arches; local Tahoe options include Nevada Beach Campground). Seeking Creation, Living In Beauty",
      lodging: "Hyatt Regency Lake Tahoe (Incline Village), various motels in South Lake Tahoe or Incline Village. Trip.com",
      restaurants: "Tunnel Creek Cafe (near trailhead), various options in Incline Village. Inked with Wanderlust",
      cellService: "Unreliable or limited in mountain areas; downloading offline maps is recommended. TikTok @lisarosanty, Instagram",
      weather: "Alpine climate; light is thinner and crisper at 6,000+ ft. Can be windy, causing choppy water. Bring warm clothes as temperatures can drop significantly (even to 17\u00b0F in winter). Check cloud cover; 20-30% high clouds provide the best sunset 'burn'. Edin Chavez Photography, Flickr",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/bonsai-rock",
      photos: []
    },
    {
      name: "Bright Angel Point",
      nearbyTown: "Jacob Lake, Kanab, Page",
      state: "AZ, UT",
      region: "Southwest",
      lat: "36.1935306",
      lng: "-112.0486333",
      elevation: "8,227 Ft. (Photographers Trail Notes)",
      trailDifficulty: "2 (Moderate) on a scale of 1-5 (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise, sunset, or twilight (late afternoon/sunset is preferred) according to Photographers Trail Notes",
      bestTimeOfYear: "Mid-May through mid-October (when the North Rim is open). Dramatic weather opportunities are best during the monsoon season from mid-July to mid-August (Photographers Trail Notes)",
      photographyTips: "Arrive at least an hour early to visualize the canyon. Finding a composition that captures the trail leading to the edge can be challenging but rewarding (Photographers Trail Notes)",
      shotDirection: "Most compositions will involve shooting south around 180\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "Wide-angle (24mm or 35mm) for grand vistas, standard, and telephoto (70-200mm) for isolating features (Photographers Trail Notes)",
      equipmentNeeded: "A tripod is recommended; panoramic equipment may be useful for wide views (Photographers Trail Notes)",
      permits: "National Park entrance fee is required (Photographers Trail Notes)",
      directions: "From the North Rim Visitor Center, walk along the east rim of the canyon past the Grand Canyon Lodge. The nearest community is Jacob Lake (43 miles), with Kanab, UT and Page, AZ also nearby (Photographers Trail Notes)",
      camping: "North Rim Campground, DeMotte Campground (Photographers Trail Notes)",
      lodging: "Grand Canyon Lodge North Rim, The Kaibab Lodge at the North Rim (Photographers Trail Notes)",
      restaurants: "Main Lodge Dining Room, Jacob Lake Inn (Photographers Trail Notes)",
      cellService: "Spotty and weak; Verizon users may find a signal at the very end of the point or around the visitor center (Photographers Trail Notes)",
      weather: "Temperatures are cooler than the South Rim due to the 8,200 ft elevation. The rim is closed during winter (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/bright-angle-point",
      photos: []
    },
    {
      name: "Cape Royal",
      nearbyTown: "North Rim, Arizona (National Park Service)",
      state: "Arizona",
      region: "Southwest",
      lat: "36.1172333",
      lng: "-111.9487833",
      elevation: "7,560 ft (Photographers Trail Notes), 7,865 ft at the southernmost viewpoint (Tripadvisor)",
      trailDifficulty: "2.5 (Modest) on a 1-5 scale (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise and Sunset (Photographers Trail Notes)",
      bestTimeOfYear: "Mid-May to mid-October (when the North Rim is open) (National Park Service). Late summer is noted for \"glow\" on Wotans Throne (Photographers Trail Notes)",
      photographyTips: "Focus on the \"glow\" on Wotans Throne at sunrise or sunset, which lasts 2-3 minutes. In late summer, the glow and the last sunbeam may happen minutes apart, requiring multiple exposures for compositing (Photographers Trail Notes). Use the Angel's Window to frame the Colorado River (Beyond The Journey)",
      shotDirection: "Facing West and Southwest for sunset (Gary Hart Blog); views also extend East toward the Painted Desert and Desert View Watchtower (Photographers Trail Notes)",
      lensesNeeded: "Mainly ultra-wide angle (11mm to 16mm) for expansive canyon views (Photographers Trail Notes). Telephoto lenses are also recommended for compressing ridges and capturing distant features like the Desert View Watchtower (Gary Hart Blog)",
      equipmentNeeded: "Tripod, polarizer, and potentially a graduated neutral density filter (Gary Hart Blog)",
      permits: "A National Park entrance fee is required ($35/vehicle); no specific backcountry permit is needed for the Cape Royal Trail itself (GrandCanyon.com). Commercial workshops require a Commercial Use Authorization (CUA) (National Park Service)",
      directions: "From the North Rim Entrance Station, drive south for 9.6 miles. Turn left onto the road for Point Imperial and Cape Royal. After 5.4 miles, turn right toward Cape Royal and continue 14.3 miles to the end of the road (Anne's Travels)",
      camping: "North Rim Campground (National Park Service), DeMotte Campground (US Forest Service)",
      lodging: "Grand Canyon Lodge - North Rim (National Park Service), Jacob Lake Inn (Jacob Lake Inn)",
      restaurants: "Grand Canyon Lodge North Rim Dining Room, Deli in the Pines, Roughrider Saloon (National Park Service)",
      cellService: "Very remote area with generally no cell service (Facebook Group), though light signals from the Navajo Nation may sometimes be received (NPS Podcast)",
      weather: "Temps are typically 5-10 degrees cooler than the South Rim; summer monsoon storms (July-September) bring lightning and dramatic clouds (Adam Schallau Photography)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/cape-royal",
      photos: []
    },
    {
      name: "Cathedral Gorge (specifically the Moon Caves area) Photographers Trail Notes",
      nearbyTown: "Panaca, NV Photographers Trail Notes",
      state: "Nevada Photographers Trail Notes",
      region: "Southwest",
      lat: "37.819639",
      lng: "-114.410472",
      elevation: "4,887 Ft. Photographers Trail Notes",
      trailDifficulty: "1 (Easy) - The shot is taken from the parking area Photographers Trail Notes",
      bestTimeOfDay: "Best photographed 3 to 15 minutes after sunset. The featured image was taken at 7:11 pm with sunset at 7:07 pm Photographers Trail Notes",
      bestTimeOfYear: "Any time of year, but late fall, winter, and early spring are best as the setting sun illuminates the formation. In summer, sunset is blocked by a large hill to the northwest Photographers Trail Notes",
      photographyTips: "Position yourself at an angle where the 'Cathedral' stands out from the hills. Wait until 3-15 minutes after sunset for reflective light to avoid overexposure. For slot canyons, look up to capture the 20-30ft towering walls Photographers Trail Notes and John Clark Photography",
      shotDirection: "North (approximately 350\u00b0) Photographers Trail Notes",
      lensesNeeded: "Wide-angle lenses are recommended, such as 14-24mm or 16-35mm for slot canyons. Standard lengths up to 70mm are also useful. The featured shot was taken at 35mm Photographers Trail Notes and John Clark Photography",
      equipmentNeeded: "A sturdy tripod is essential. A polarizer can help with color contrast and reducing glare on the clay formations Photographers Trail Notes and John Clark Photography",
      permits: "A $5.00 per vehicle day-use fee is required for Nevada licensed vehicles ($10.00 for non-Nevada). Professional shoots require a permit with liability insurance Photographers Trail Notes and Nicole Christiansen Photography",
      directions: "From Las Vegas, drive north on I-15 for 21 miles, then take US-93 north for 142 miles to Panaca, NV. Continue 1 mile north on US-93 to the park entrance. From the park kiosk, drive 0.9 miles to the Moon Caves dirt parking area Photographers Trail Notes",
      camping: "Cathedral Gorge State Park Campground Photographers Trail Notes",
      lodging: "Pine Tree Inn and Bakery Bed and Breakfast, Cathedral Gorge Inn Agoda and Hipcamp",
      restaurants: "Sher E Punjab Dhaba, Historic Silver Caf\u00e9, The Nevada Club Tripadvisor",
      cellService: "Cell service is reported as spotty or non-existent in the gorge areas Facebook and Photographers Trail Notes",
      weather: "Arid high desert climate with semi-hot summers (up to 95\u00b0F) and very cold winters. Temperatures can drop 30-40 degrees at night. Flash floods can affect the bentonite clay ground Latitude.to and NJ Productions",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/cathedral-gorge",
      photos: []
    },
    {
      name: "Chaco Canyon (Pueblo Bonito)",
      nearbyTown: "Cuba",
      state: "New Mexico",
      region: "Southwest",
      lat: "36.0563",
      lng: "-107.9570",
      elevation: "6,144 ft. Photographers Trail Notes",
      trailDifficulty: "2 (EASY scale 1-5) - a 300-yard walk from the parking lot. Photographers Trail Notes",
      bestTimeOfDay: "Early morning, specifically from sunrise to approximately 1.5 hours after sunrise on a clear day to capture the \"golden glow\" on the back wall. Photographers Trail Notes",
      bestTimeOfYear: "While shootable most of the year, the best time is from mid-September to mid-February (and a few weeks after daylight savings) when the sunrise occurs after the park gates open at 7:00 am. Photographers Trail Notes",
      photographyTips: "The shot relies on the early morning glow on the back wall of room #16. Composition is challenging because the ancient walls and doors are not level; photographers should pick one straight line to align with. The relationship between the front and back doors changes with distance and lateral movement, so scouting the day before is recommended. Photographers Trail Notes",
      shotDirection: "East around 87\u00b0. Photographers Trail Notes",
      lensesNeeded: "28-50mm (the classic doorway shot is often captured at 40mm). Photographers Trail Notes",
      equipmentNeeded: "Tripod, small broom or towel (to sweep away footprints in the ruins). Photographers Trail Notes",
      permits: "National Park Service entrance permit ($25 per vehicle, valid for 7 days) required. Photographers Trail Notes",
      directions: "From Albuquerque, travel north on US-550 to Cuba, NM. Continue 49 miles on US-550 to CR-7900, turn left and drive 4.9 miles, then turn right onto CR-7950 (a rough dirt road). Follow CR-7950 into the park, pass the visitors' center, and enter the one-way loop to the Pueblo Bonito parking lot. Photographers Trail Notes",
      camping: "Gallo Campground (inside the park). Photographers Trail Notes",
      lodging: "Best Western (Bloomfield), Super 8 (Bloomfield), Frontier Motel (Cuba). Photographers Trail Notes",
      restaurants: "El Bruno\u2019s Mexican Restaurant (Cuba, NM). Photographers Trail Notes",
      cellService: "There is no cell service (Verizon) anywhere around Chaco Canyon; coverage improves upon returning to US-550. Photographers Trail Notes",
      weather: "Spring and fall offer moderate temperatures; summer highs range from 80s to mid-90s with thunderstorms; winter nights can drop to 10-20\u00b0F. Rain can make the dirt access road impassable. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/chaco-canyon",
      photos: []
    },
    {
      name: "Coal Mine Canyon",
      nearbyTown: "Tuba City",
      state: "AZ",
      region: "Southwest",
      lat: "36.011240",
      lng: "-111.049006",
      elevation: "5,618 Ft. (Photographers Trail Notes)",
      trailDifficulty: "2.5 on a scale of 1-5 (Moderate) (Photographers Trail Notes)",
      bestTimeOfDay: "Late afternoon (about 30-45 minutes before sunset) or sunrise/early morning. Arrive at least one hour before sunset to capture the sun's rays in the canyon (Photographers Trail Notes)",
      bestTimeOfYear: "Any time of the year, but non-summer months are preferred. In the summer, the sun sets at the front left of the shot; in spring/fall, it sets more to the left (Photographers Trail Notes)",
      photographyTips: "Arrive early to scout compositions along the rim. This is not a sunset shot; once the sun sets, the canyon loses illumination, color, and depth. Be ready to shoot an hour before sunset (Photographers Trail Notes)",
      shotDirection: "North by Northwest (around 350\u00b0) (Photographers Trail Notes)",
      lensesNeeded: "Ultra-wide to telephoto focal lengths. An example shot was taken at 32mm (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod, polarizer, and possibly a tilt/shift lens to compensate for the keystone effect when pointing down (Photographers Trail Notes)",
      permits: "A Navajo Nation permit is required. Permits can be obtained at the Cameron Visitor Center (intersection of Highways 89 and 64) for approximately $12 per person per day (Photographers Trail Notes)",
      directions: "From Tuba City, go south to the south entrance. Pass through the cattle gate and travel 0.4 miles to a split; veer right. Drive down the hill for 0.3 miles to another split; veer left and drive 0.8 miles (1.5 miles total). Park and walk 1/4 mile or drive to the rim if the road is dry (Photographers Trail Notes)",
      camping: "Coal Mine Canyon (Photographers Trail Notes)",
      lodging: "Tuba City (Photographers Trail Notes)",
      restaurants: "Hogan Family Restaurant, Cameron Trading Post (Photographers Trail Notes)",
      cellService: "Spotty (Verizon); a stronger signal is available as you approach Tuba City (Photographers Trail Notes)",
      weather: "High desert climate with temperatures varying 30\u00b0-40\u00b0 daily. Summer temperatures can reach the high 90s. The dirt road becomes extremely muddy and potentially impassable during rain (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/coal-mine-canyon",
      photos: []
    },
    {
      name: "Dead Horse Point",
      nearbyTown: "Moab",
      state: "Utah",
      region: "Southwest",
      lat: "38.46913",
      lng: "-109.74009",
      elevation: "5,944 Ft. (Photographers Trail Notes)",
      trailDifficulty: "1 to 3 (on a 1-5 scale). The walk from the parking lot is a 1 (moderate 150yd walk), but walking below the overlook to the ledge with a 1,000ft drop is rated a 3 (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise and Sunset (Photographers Trail Notes). Sunrise is peaceful with light traveling across the canyon, while sunset is the most popular time with warm colors on the fins and mesas (Discover Moab)",
      bestTimeOfYear: "Any time of year, though clouds and interesting weather help produce better images (Photographers Trail Notes). Early spring and late fall offer the most comfortable temperatures and excellent clarity (Discover Moab)",
      photographyTips: "Arrive early to walk the ridge and find unique compositions. Use foreground elements like the \"famous curved bush\" located 50-75 yards along the right side of the ledge from the main overlook. Bracket exposures at sunrise due to extreme dynamic range; the best light lasts only 3-5 minutes after the sun crests the horizon (Photographers Trail Notes)",
      shotDirection: "Mainly South at approximately 200\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "16mm to 135mm; suitable for panoramas, tight compressions, or wide-angle vistas (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod, polarizer, and optionally a tilt/shift lens to compensate for the keystone effect when pointing down toward the river (Photographers Trail Notes)",
      permits: "State Park entry fee is required, which was $20 per car in 2025 (Discover Moab)",
      directions: "From Moab, travel northwest on US-191 for 11 miles. Turn left onto UT-313 and drive west and then south for 14.6 miles to the park sign. Continue 8.0 miles to the main parking lot. Follow the cement sidewalk to the covered visitor area and turn right to reach the overlook (Photographers Trail Notes)",
      camping: "Kayenta Campground, Wingate Campground, Horsethief Campsite, Cowboy Campsite (Photographers Trail Notes)",
      lodging: "Red Cliffs Lodge, INCA Inn and Motel, Gonzo Inn (all located in Moab) (Photographers Trail Notes)",
      restaurants: "No food services are available inside the park. Recommended in Moab: River Grill Restaurant, The Broken Oar, Desert Bistro, Antica Forma, Moab Garage Co., Zax (Photographers Trail Notes)",
      cellService: "Limited and spotty; signals are typically weak until returning to Moab (Photographers Trail Notes)",
      weather: "High desert climate with temperatures varying up to 40\u00b0 in a single day. Summer can exceed 100\u00b0F, while late summer monsoons bring violent thunderstorms and potential flash floods (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/dead-horse-point",
      photos: []
    },
    {
      name: "Delicate Arch",
      nearbyTown: "Moab",
      state: "Utah",
      region: "Southwest",
      lat: "38.7436",
      lng: "-109.4993",
      elevation: "4,739 ft Photographers Trail Notes",
      trailDifficulty: "3 (Moderate to Difficult on a 1-5 scale) Photographers Trail Notes",
      bestTimeOfDay: "Sunset (primary) and Sunrise (for fewer crowds). Arrive at least an hour early to scout compositions Photographers Trail Notes",
      bestTimeOfYear: "Any time of year, though Spring (March-May) and Fall (September-October) offer the best weather for the strenuous hike Photographers Trail Notes",
      photographyTips: "Keep the horizon level as the arch itself is not vertical. Walk around the entire arch to find unique compositions beyond the classic view. Use the 'Frame Arch' (located 50 yards before the end of the trail) to frame the main arch Photographers Trail Notes",
      shotDirection: "Southeast (facing the arch with the La Sal Mountains in the background) Firefall Photography",
      lensesNeeded: "16mm to 70mm focal lengths recommended Photographers Trail Notes",
      equipmentNeeded: "Sturdy tripod, polarizing filter, headlamp (essential for hiking back after sunset), and plenty of water (1 gallon per person recommended in summer) Fototripper",
      permits: "National Park Entrance Fee and Timed Entry Reservation (required from April through October) K\u00dcHL",
      directions: "Start at the Wolfe Ranch parking area. The trail is a 3.2-mile roundtrip hike that is primarily uphill on the way to the arch Photographers Trail Notes",
      camping: "Devils Garden Campground Wildland Trekking",
      lodging: "Adventure Inn, Gonzo Inn, Lazy Lizard Hostel, Fairfield Inn & Suites Moab Moore Misadventures",
      restaurants: "Moab eateries (including various options on Main Street) Photographers Trail Guides",
      cellService: "Limited or no cell service available in the park Weber State Outdoor Blog",
      weather: "Extreme heat in summer (exceeding 100\u00b0F), cold in winter with occasional snow, and potential for flash floods during storms Weber State Outdoor Blog",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/delicate-arch",
      photos: []
    },
    {
      name: "Desert View (Navajo Point)",
      nearbyTown: "Grand Canyon Village (25 miles west) or Cameron (32 miles east), AZ. Photographers Trail Notes GrandCanyon.com",
      state: "Arizona (AZ)",
      region: "Southwest",
      lat: "36.0467",
      lng: "-111.8272",
      elevation: "7,454 Ft. Photographers Trail Notes",
      trailDifficulty: "1 (Easy) on a 1-5 scale. The shot location is an easy 25-yard walk from the Navajo Point parking lot. Photographers Trail Notes",
      bestTimeOfDay: "Best shot just before sunset as the east walls of the canyon are illuminated in the soft light of the end of the day. Even after the sun sets, twilight offers great shots with the pastel colors of the canyon. During monsoon season (late June to mid-September), late afternoon thunderstorms are ideal. Photographers Trail Notes Monsoon Storm",
      bestTimeOfYear: "Can be photographed any time of year. Summer/Late Summer is noted for monsoon storms (late June to mid-September, with late July to mid-August as best), while winter provides opportunities for snow. Photographers Trail Notes Monsoon Storm Mather Point Guide",
      photographyTips: "Focus on the right light to produce a magical image. Navajo Point (0.5 miles west of Desert View) is highly recommended for fewer visitors and superior views of the Colorado River and west-facing walls. Even after sunset, the back walls retain a warm glow that the camera picks up better than the eye. Photographers Trail Notes Mather Point Guide",
      shotDirection: "West to Northwest (typically about 10-15\u00b0 west for sunset/monsoon shots). Monsoon Storm",
      lensesNeeded: "Versatile options including wide angle, panoramic, or compression. A 60mm lens was used for the primary featured shot. Recommended range covers wide-angle to telephoto for different compositions. Photographers Trail Notes Monsoon Storm",
      equipmentNeeded: "A sturdy tripod is recommended, especially for long exposures at twilight or during storms. Monsoon Storm",
      permits: "Grand Canyon National Park entry fee ($35 per vehicle as of July 2024). Once inside the park, no other specific photography permits are required for personal use. Monsoon Storm",
      directions: "From Cameron, AZ: Drive south on US89 for 1.4 miles to the traffic circle, then west on AZ-64/Desert View Dr. for 30 miles to the East Entrance. Drive 0.3 miles past the entrance and turn into Desert View. From Grand Canyon Village: Take AZ-64/Desert View Dr. east for 22.5 miles and take the Desert View turnoff. Monsoon Storm",
      camping: "Desert View Campground (within the park near the location). Tripadvisor",
      lodging: "Yavapai Lodge, El Tovar Hotel, Red Feather Lodge (located in Grand Canyon Village/Tusayan area, ~25 miles west). Tripadvisor",
      restaurants: "Desert View Trading Post, Desert View Market (at Desert View); Plaza Bonita (Tusayan). Tripadvisor",
      cellService: "Hit or miss (Verizon mentioned as having spotty service). Monsoon Storm",
      weather: "High desert climate with temperatures varying 30\u00b0-40\u00b0 daily. Monsoon season (late summer) brings dramatic storms and lightning. Winter can bring snow to the canyon edges. Monsoon Storm Mather Point Guide",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/desert-view",
      photos: []
    },
    {
      name: "Duckhead Man",
      nearbyTown: "Mexican Hat (Photographers Trail Notes)",
      state: "Utah (Photographers Trail Notes)",
      region: "Southwest",
      lat: "37.238361",
      lng: "-110.001833",
      elevation: "5,353 Ft. (Photographers Trail Notes)",
      trailDifficulty: "2.5 on a 1-5 scale (Moderate) (Photographers Trail Notes)",
      bestTimeOfDay: "Early morning (sunrise to 1 hour after) or after sunset (10-20 minutes after), ideally when the sun is not hitting the rock directly to achieve muted lighting (Photographers Trail Notes)",
      bestTimeOfYear: "Anytime the road is driveable; however, the road can be closed in winter due to snow (Photographers Trail Notes)",
      photographyTips: "Shoot under muted lighting to avoid direct sun on the rock. Because the petroglyph is 10-12 feet above the standing area, position the camera as high as possible to minimize keystone distortion (Photographers Trail Notes)",
      shotDirection: "North (approximately 0\u00b0) (Photographers Trail Notes)",
      lensesNeeded: "Suggested focal length of around 100mm; drones with a 50mm equivalent lens are also useful (Photographers Trail Notes)",
      equipmentNeeded: "No special equipment is needed, though a sturdy tripod is recommended for shooting in muted light (Photographers Trail Notes)",
      permits: "No permits are currently required for this area (Photographers Trail Notes)",
      directions: "From Mexican Hat, drive north on US-163 N for about 4 miles. Turn left on UT-261 and drive 0.9 miles, then take UT-316 toward Gooseneck State Park. After 0.5 miles, turn right onto Johns Canyon Rd (Dirt road 244). Take this road for a little over 9 miles, passing a swinging fence at 7.4 miles. Look for a small pullout on the right; the petroglyph panel is located 30-75 yards up the hill on the second set of rocks with a black facing (Photographers Trail Notes)",
      camping: "Johns Canyon, Cedar Mesa (Photographers Trail Notes)",
      lodging: "Mexican Hat (Photographers Trail Notes)",
      restaurants: "Mexican Hat (Photographers Trail Notes)",
      cellService: "Spotty (Photographers Trail Notes)",
      weather: "Arid desert climate with summer highs in the upper 90s and winter lows in the 20s (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/duckhead-man",
      photos: []
    },
    {
      name: "Factory Butte",
      nearbyTown: "Hanksville",
      state: "Utah (UT)",
      region: "Southwest",
      lat: "38.4606694",
      lng: "-110.8883583",
      elevation: "4,687 Ft",
      trailDifficulty: "2 (Moderate) on a scale of 1-5; the road (Coal Mine Rd) is easy to moderate with some bumpy spots",
      bestTimeOfDay: "The shot is best at predawn (15 - 30 minutes before sunrise) before any light illuminates the butte. Once the sun crests the horizon, the colors/hues change substantially",
      bestTimeOfYear: "Available all year, but late fall, winter, and early spring provide better side-light (contrast) for the rock veins as the angle of the sunrise is more favorable",
      photographyTips: "Arrive before sunrise for indirect predawn light. The magic is in the post-processing; the camera sees a blue color before sunrise, which can be enhanced. Focus on capturing the rock veins with side-light",
      shotDirection: "Southwest at 220\u00b0",
      lensesNeeded: "Compression shots from the road work best with a longer lens (135mm to 200mm), though wide-angle lenses can be used closer to the butte",
      equipmentNeeded: "No special photography equipment needed other than a sturdy tripod",
      permits: "No permits required in the area",
      directions: "From Hanksville, travel west 10.6 miles on UT-24 to 6650 EAST (Coal Mine Rd). Turn right and travel 0.8 miles to a fork. Stay right and travel 6.2 miles to a small parking/camping area next to a rock formation",
      camping: "Duke's Slickrock Campground & RV Park, small unnamed camping area just off the road",
      lodging: "Muddy Creek Mining Company, Whispering Sands Motel",
      restaurants: "Duke\u2019s Slickrock Grill, Stan's Burger Shak, Outlaw\u2019s Roost",
      cellService: "Spotty (Verizon); a stronger signal is available as you near Hanksville",
      weather: "High desert climate; temperatures can vary 30\u00b0-40\u00b0 daily. Spring and fall are pleasant; summer can reach high 90s",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/factory-butte",
      photos: []
    },
    {
      name: "Fallen Roof Ruin",
      nearbyTown: "Blanding",
      state: "Utah",
      region: "Southwest",
      lat: "37.3961",
      lng: "-109.8725",
      elevation: "6,400 ft (Photographers Trail Notes)",
      trailDifficulty: "3 out of 5 (Moderate to Hard due to steep canyon descent and route-finding) (Photographers Trail Notes)",
      bestTimeOfDay: "Mid-morning (approximately 9:00 AM to 11:00 AM) before the sun directly enters the alcove, or on overcast days for soft, even light (DPReview, onX Maps)",
      bestTimeOfYear: "Late spring, summer, and early fall are best for the reflected light effect; winter is less ideal as the lower sun angle can shine directly into the alcove (Photographers Trail Notes)",
      photographyTips: "Focus on the ceiling where reflected light from the opposite canyon wall creates a 'glow.' Utilize both landscape and portrait orientations to include the surrounding rock patterns. Use bracketing to manage high contrast between the dark alcove and bright canyon. Be extremely cautious of the cliff edge while composing (Charlie Borland/YouTube, Photographers Trail Notes)",
      shotDirection: "North (approximately 0-20 degrees) when facing the ruin inside the south-facing alcove (onX Maps)",
      lensesNeeded: "Wide-angle lenses such as 16-35mm (full frame) or 12-24mm (crop sensor) are recommended to capture the ruin and the decorated ceiling (Charlie Borland/YouTube)",
      equipmentNeeded: "GPS unit or hiking app with offline maps, lightweight tripod, cable release, sturdy hiking boots, and at least 2-3 liters of water (Charlie Borland/YouTube, Photographers Trail Notes)",
      permits: "A BLM Day Hiking Pass ($5/person/day) is required for Cedar Mesa, available at trailhead kiosks or via recreation.gov. Backpacking requires a separate permit ($15/person) (BLM, Recreation.gov)",
      directions: "From UT-261, turn onto Cigarette Springs Road. Drive 3.4-3.5 miles (passing the BLM fee station at 1 mile) to an unmarked trailhead on the left (north). Hike northeast for 0.3 miles, drop steeply into the side canyon, and follow it to the main branch of Road Canyon. Turn right and look for the ruins on a ledge about 100-150 feet past a prominent hoodoo on the left (onX Maps, MishMoments)",
      camping: "Primitive camping is available along Cigarette Springs Road; backpacking campsites are also available near springs in Road Canyon (CNHA, BLM)",
      lodging: "Stone Lizard Lodge, Blue Sage Inn & Suites, Bears Ears Inn, Four Corners Inn, Rodeway Inn & Suites, Prospector Motor Lodge (Tripadvisor, Expedia)",
      restaurants: "Patio Diner, Homestead Steak House, Yaks Cafe, Smoke Pizza Company, Subway (Tripadvisor, Evendo)",
      cellService: "Non-existent in the canyons and very limited/spotty throughout the Cedar Mesa area (Andrew Skurka)",
      weather: "High desert climate with extreme heat in summer and cold winters. Flash floods are a significant risk in the canyons during monsoons; always check local conditions at the Kane Gulch Ranger Station (BLM)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/fallen-roof-ruin",
      photos: []
    },
    {
      name: "Fiery Furnace Photographers Trail Notes",
      nearbyTown: "Moab Photographers Trail Notes",
      state: "Utah Photographers Trail Notes",
      region: "Southwest",
      lat: "38.74377",
      lng: "-109.56477",
      elevation: "4,744 ft Photographers Trail Notes",
      trailDifficulty: "1 (Easy) on a scale of 1-5. Photographers Trail Notes",
      bestTimeOfDay: "Just before sunset. The glow on the rocks only lasts for a few moments, so it is important to be prepared. Photographers Trail Notes",
      bestTimeOfYear: "Great any time of year. Late Fall, Winter, and early Spring often provide snow on the nearby La Sal Mountains, which makes for a nice background. Photographers Trail Notes",
      photographyTips: "The fins create high-contrast shadows during the day, making exposure bracketing difficult. Plan ahead as the sunset glow is very brief. Photographers Trail Notes",
      shotDirection: "Mainly Southeast @ 140\u00b0. Photographers Trail Notes",
      lensesNeeded: "100mm (equivalent); the featured shot was a two-shot vertical pano. Photographers Trail Notes",
      equipmentNeeded: "Polarizer (to enhance the red glow). Photographers Trail Notes",
      permits: "Special permit and fee required ($10 per person) even after entering the park. Permits must be reserved online at recreation.gov at least two days in advance and picked up at the Arches Visitor Center. Photographers Trail Notes",
      directions: "From Moab, drive northwest on US 191 for approximately 4.5 miles and turn right into Arches National Park. Follow the main park road to the Fiery Furnace parking lot. From the parking area, follow the Fiery Furnace Loop trail north for about 400 feet. Photographers Trail Notes",
      camping: "None listed on the page. Photographers Trail Notes",
      lodging: "None listed on the page. Photographers Trail Notes",
      restaurants: "Gloria's, Bonjour Bakery, Love Muffin, Red Rock Bakery & Net Cafe, Moab Diner, Dewey's, Antica Forma, Pasta Jay's, Horizon View Bar & Grill, Spitfire Smokehouse, Zak's, Desert Bistro, The Spoke, Broken Oar, The Sultan, Quesadilla Mobilla, Tacos El Gordo. Photographers Trail Notes",
      cellService: "Spotty service (Verizon) throughout Arches National Park. Some parts have no service at all. Photographers Trail Notes",
      weather: "High desert climate with temperature fluctuations of 30\u00b0 to 40\u00b0 daily. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/fiery-furnace",
      photos: []
    },
    {
      name: "Goosenecks State Park",
      nearbyTown: "Mexican Hat, Utah (Visit Utah)",
      state: "Utah",
      region: "Southwest",
      lat: "37.1744293",
      lng: "-109.9266351",
      elevation: "4,957 feet (Photographers Trail Notes)",
      trailDifficulty: "1 (Easy) \u2014 The main viewpoint is a short, flat walk from the parking lot (Unicorn Adventure). A more rugged, unmarked path (Honaker Trail) exists for those wanting to descend towards the river, which is significantly more difficult (Visit Utah)",
      bestTimeOfDay: "Sunrise and sunset are the prime times for photography at Goosenecks State Park (Unicorn Adventure). Early morning and late afternoon provide the best light and most intense colors, while the middle of the day produces flat colors and harsh shadows (Tripadvisor). Late afternoon is particularly recommended to avoid deep shadows on the east bank of the river (Tripadvisor)",
      bestTimeOfYear: "Spring and Fall are the best times to visit due to lower, more tolerable temperatures (Visit Utah). Summer can be extremely hot with no shade, and winter can be chilly but offers a peaceful experience with fewer crowds (Unicorn Adventure)",
      photographyTips: "Use panoramic shooting techniques to capture the six miles of river loops that wind within a 1.5-mile area (Photographers Trail Notes). Side lighting at sunset can emphasize the canyon's 1,000-foot depth and create dramatic shadows (YouTube). The park is a certified International Dark Sky Park, making it ideal for Milky Way and star photography (Visit Utah)",
      shotDirection: "The primary view from the overlook is towards the south, overlooking the most prominent gooseneck of the San Juan River (YouTube)",
      lensesNeeded: "Ultra wide-angle lenses are essential, such as 14mm or 16-35mm. A 24-240mm lens or similar can be used for panoramic stitching (Photographers Trail Notes, Facebook)",
      equipmentNeeded: "A tripod and panoramic head are highly recommended for stitching multiple images together to capture the full scope of the meanders (Photographers Trail Notes). Sturdy shoes are recommended for the uneven, sandy paths (Unicorn Adventure)",
      permits: "A $5 day-use entry fee per vehicle is required (Visit Utah). Recreational drone use is permitted during specific winter months with possible restrictions (YouTube)",
      directions: "From Mexican Hat, take US-163 north for approximately 4 miles, turn left onto UT-261 and follow it for 3 miles, then turn left onto UT-316 (Goosenecks State Park Road) for the final 3 miles to the park (Unicorn Adventure)",
      camping: "Goosenecks State Park Campground (primitive), Sleeping Bear Campground, Sand Island Campground (Tripadvisor)",
      lodging: "Hat Rock Inn, San Juan Inn, Mexican Hat Lodge, Canyonlands Motel, The View Hotel (Monument Valley), Desert Rose Resort & Cabins (Bluff) (Tripadvisor, Expedia)",
      restaurants: "San Juan Inn Restaurant, Mexican Hat Lodge (Steakhouse), The View Restaurant (Tripadvisor)",
      cellService: "The park is in a remote area with limited to no cell service (Utah State Parks)",
      weather: "Arid desert climate with extreme heat in the summer (exceeding 100\u00b0F) and no shade. The area can be very windy, especially near the cliff edges (Visit Utah). Winters are chilly with rare but possible snow (Unicorn Adventure)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/gooseneck-state-park",
      photos: []
    },
    {
      name: "Grand Falls (Chocolate Falls)",
      nearbyTown: "Flagstaff, Arizona (approx. 40 miles / 1 hour away). Photographers Trail Notes",
      state: "Arizona",
      region: "Southwest",
      lat: "35.427861",
      lng: "-111.200194",
      elevation: "4,495 Ft. Photographers Trail Notes",
      trailDifficulty: "1 on a scale of 1-5 (Moderate walk of 150 yards from parking lot). Photographers Trail Notes",
      bestTimeOfDay: "Sunset (primary), Sunrise (possible with good cloud coverage). Photographers Trail Notes",
      bestTimeOfYear: "Spring (March - April) due to snowmelt and Monsoon season (July - September). High water flow is critical. Photographers Trail Notes",
      photographyTips: "Straightforward shot; likely need image blending, HDR, or graduated filters. Use ND filters for silky water. Use a polarizer for glare and spray. Photographers Trail Notes",
      shotDirection: "Sunset shot: North (~0\u00b0); Sunrise shot: Northeast (~50\u00b0). Photographers Trail Notes",
      lensesNeeded: "Wide-angle (16-35mm) preferred; mid-range (24-70mm) or telephoto (100-140mm+) for tighter shots. Photographers Trail Notes",
      equipmentNeeded: "Tripod, ND filter (for slow shutter speed), polarizer filter (to reduce glare), water, toilet paper, hand sanitizer. Photographers Trail Notes",
      permits: "As of January 2020, no permits were required, but check Leupp Nation Website. Note: Closed as of March 1, 2023. Photographers Trail Notes",
      directions: "From Flagstaff, travel northeast on I-40 to exit 211 (Winona). Take Townsend Winona Rd for 2 miles, turn right on Leupp Rd. After 14.8 miles, turn left on Indian Rte 70 and drive 9 miles to the parking area. Photographers Trail Notes",
      camping: "Small campground at Grand Falls; Flagstaff KOA (45 min away). Photographers Trail Notes",
      lodging: "Best Western Pony Soldier Inn & Suites, Super 8 by Wyndham Flagstaff. Photographers Trail Notes",
      restaurants: "Lumberyard Tap Room & Grill, Delhi Palace, Nimarcos Pizza (all in Flagstaff). Photographers Trail Notes",
      cellService: "Sketchy at the falls; recommended to download maps before leaving I-40 area. Photographers Trail Notes",
      weather: "High desert climate; temperatures vary up to 30\u00b0 daily. Summer highs in the 90s. Spring/Fall are pleasant. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/grand-falls",
      photos: []
    },
    {
      name: "Green River Overlook",
      nearbyTown: "Moab, UT (approximately 42-50 miles away) (Photographers Trail Notes)",
      state: "Utah",
      region: "Southwest",
      lat: "38.378292",
      lng: "-109.888344",
      elevation: "6,152 feet (Photographers Trail Notes)",
      trailDifficulty: "1 (Easy) - A 150-yard walk from the parking lot on a paved sidewalk (Photographers Trail Notes)",
      bestTimeOfDay: "Sunset is the premier time to shoot, as the late sun reflects off distant buttes and illuminates the canyon\u2019s west-facing walls (Photographers Trail Notes). Under specific weather conditions, sunrise can also provide excellent photographic opportunities (Photographers Trail Notes)",
      bestTimeOfYear: "While it can be photographed year-round, the monsoon season (mid-July to mid-September) is considered best because it brings dramatic weather, including brief but violent thunderstorms and unique lighting (Photographers Trail Notes). Spring and fall offer pleasant temperatures, while summer can exceed 100\u00b0F (Photographers Trail Notes)",
      photographyTips: "The shot is defined by weather and light; dramatic conditions like storm clouds or lightning strikes are highly desirable. Use gnarled and twisted junipers to the west (right) of the overlook as foreground elements. Incorporating the Rule-of-Thirds and leading lines (like the river fingers) can enhance the composition (Photographers Trail Notes, Luminous Landscape)",
      shotDirection: "Mainly 240\u00b0 (Southwest), though the source text identifies it as \"southeast @ 240\u00b0\" (Photographers Trail Notes)",
      lensesNeeded: "A 50mm lens was used for the primary featured shot. Recommended focal lengths include wide-angle (14mm, 16-35mm, or 24mm) for vastness and telephoto (70-200mm, 100-400mm, or 24-105mm) to isolate river fingers and buttes (Photographers Trail Notes, National Parks Traveler)",
      equipmentNeeded: "A sturdy tripod is essential. Food and drinks are recommended if arriving well before sunrise or staying late (Photographers Trail Notes). Sturdy hiking shoes and sun protection are also advised for the desert environment (Truce Now)",
      permits: "An entrance fee for Canyonlands National Park is required (currently $35 for 7 days), purchasable at the visitor center (Photographers Trail Notes)",
      directions: "From Moab, travel northwest on US-191 for 11 miles to the Canyonlands entrance. Turn left on UT-313 and drive west/south for 27.8 miles to Upheaval Dome Rd. Turn right on Upheaval Dome Rd for 0.3 miles, then left on Green River Overlook Rd for 1.4 miles to the parking lot. The overlook is an easy 150-yard walk on a paved sidewalk (Photographers Trail Notes)",
      camping: "Willow Flat Campground (1/4 mile west), Kayenta Campground (19 miles north at Dead Horse Point), Horsethief Campsite (18 miles north), Cowboy Campsite (17 miles north) (Photographers Trail Notes)",
      lodging: "Red Cliffs Lodge, INCA Inn and Motel, Gonzo Inn, Fairfield Inn & Suites by Marriott Moab, Hoodoo Moab by Hilton (Photographers Trail Notes, Park Ranger John)",
      restaurants: "There are no restaurants inside the park. Nearby options in Moab include Desert Bistro and Twisted Sista's Cafe (Photographers Trail Notes)",
      cellService: "Cell service is spotty throughout Canyonlands National Park; Verizon users may find limited signals, but a strong connection is generally unavailable until returning to Moab (Photographers Trail Notes)",
      weather: "High desert climate with temperature fluctuations of up to 40\u00b0F in a single day. The monsoon season (late summer) brings brief, violent thunderstorms and potential flash floods (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/green-river-overlook",
      photos: []
    },
    {
      name: "Havasu Falls",
      nearbyTown: "Supai (village) and Peach Springs (closest town with services). Photographers Trail Notes and Facebook",
      state: "Arizona",
      region: "Southwest",
      lat: "36",
      lng: "112",
      elevation: "2,200 - 2,600 ft. Photographers Trail Notes",
      trailDifficulty: "4 to 5 on a scale of 1-5 (Difficult). Photographers Trail Notes",
      bestTimeOfDay: "Watching the light throughout the day is key, as the canyon is deep and light changes constantly, either amplified or muted depending on cloud cover. Photographers Trail Notes",
      bestTimeOfYear: "The trail difficulty and experience depend on the time of year. Photographers Trail Notes",
      photographyTips: "Work around other people and monitor the changing light in the deep canyon. The canyon is relatively narrow, which limits compositions. Use mineral deposits to capture green and blue hues. Photographers Trail Notes",
      shotDirection: "Varies by composition; the canyon's narrowness and depth are the main constraints. Photographers Trail Notes",
      lensesNeeded: "Medium wide-angle (24-70mm or 24-105mm) for classic shots; 14mm or 16mm wide-angle prime for weight saving; teleconverter for close-ups. Photographers Trail Notes",
      equipmentNeeded: "Backpacking gear, tripod, water shoes, and potentially trekking poles for switchbacks. Photographers Trail Notes and Visit Arizona",
      permits: "Required for all visitors; reservations must be made in advance (often months/years). No-day hiking is allowed. Visit Arizona",
      directions: "The hike starts from Hualapai Hilltop, goes to Supai Village (8 miles), and then to Havasu Falls (additional 2 miles). The total hike is 10 miles each way with an elevation change of about 2,500 ft. Photographers Trail Notes",
      camping: "Havasu Falls Campground, Havasupai Campground. Tripadvisor",
      lodging: "Havasupai Lodge (in Supai Village), Hualapai Lodge (in Peach Springs). Visit Arizona and Facebook",
      restaurants: "None in the immediate vicinity of the falls; food must be brought or purchased in Supai Village. Visit Arizona",
      cellService: "Not explicitly detailed in the preview, but listed as a membership data point. Photographers Trail Notes",
      weather: "High desert climate; temperatures can be harsh depending on the season. Light is affected by cloud cover. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/havasu-falls",
      photos: []
    },
    {
      name: "Here Comes The Sun (Factory Butte)",
      nearbyTown: "Hanksville",
      state: "Utah",
      region: "Southwest",
      lat: "38.451611",
      lng: "-110.837955",
      elevation: "4,687 Ft. Photographers Trail Notes",
      trailDifficulty: "2 (Easy) - The rating accounts for the bumpy 7-mile dirt road drive rather than the walk. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise, specifically just as the sun crests the top of the butte (about 2-3 minutes after it appears). Photographers Trail Notes",
      bestTimeOfYear: "Available all year, but late fall, winter, and early spring are best for side-lighting that emphasizes the rock veins. Photographers Trail Notes",
      photographyTips: "Wait for the sun to crest the butte to capture a sunstar or the glow on the Mancos shale ripples. In winter, the sun's lower angle provides better contrast for the rock veins. Photographers Trail Notes",
      shotDirection: "West/Northwest (the sun rises behind the photographer in winter, providing side-light or back-light depending on the specific angle). Photographers Trail Notes",
      lensesNeeded: "Telephoto lens recommended; the featured shot was taken at 131mm. Photographers Trail Notes",
      equipmentNeeded: "Tripod, camera, and a high-clearance 4x4 vehicle for the bumpy dirt roads. Untamed Nomads",
      permits: "Generally none required for personal photography on BLM land. Engineer to Explore",
      directions: "From Utah State Route 24 between Capitol Reef and Hanksville, turn onto Factory Butte Road. Drive approximately 5.5 miles to the Coal Mine Road junction, then follow a 1/4 mile track to the shooting location. Engineer to Explore",
      camping: "Dispersed camping on BLM land in \"already disturbed\" areas; popular near Moonscape Overlook. Engineer to Explore",
      lodging: "Whispering Sands Motel (Hanksville), Broken Spur Inn (Torrey), Capitol Reef Resort (Torrey), Red Sands Hotel & Spa (Torrey). Engineer to Explore",
      restaurants: "Duke's Slickrock Grill, Outlaw\u2019s Roost. Engineer to Explore",
      cellService: "Spotty to non-existent; downloading offline maps is highly recommended. Untamed Nomads",
      weather: "Extremely cold winter mornings. Avoid the area if rain is forecast, as the bentonite clay roads become impassable when wet. Engineer to Explore",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/here-comes-the-sun",
      photos: []
    },
    {
      name: "Horseshoe Bend (Photographers Trail Notes)",
      nearbyTown: "Page (Photographers Trail Notes)",
      state: "Arizona (Photographers Trail Notes)",
      region: "Southwest",
      lat: "36.878706",
      lng: "-111.510686",
      elevation: "4,200 ft (Photographers Trail Notes)",
      trailDifficulty: "1.5 on a 1-5 scale (Moderate). The hike is approximately 0.6 miles (100 ft elevation gain) on a well-maintained crushed gravel trail (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise and Sunset. Sunrise: Arrive 15 minutes early; the best light lasts about 30 seconds after hitting the Vermilion Cliffs. Sunset: Sun sets directly in front of the bend from April through September; best with clouds or thunderstorms (Photographers Trail Notes)",
      bestTimeOfYear: "Sunset: April through September. Sunrise: Winter months, as the sun illuminates the pink sandstone walls of the Vermilion Cliffs (Photographers Trail Notes)",
      photographyTips: "The scale is larger than it appears; use an ultra wide lens. Sunrise light is fleeting (approx. 30 seconds). Dynamic range is extreme; blending images or HDR software may be necessary. For sunset, aim for spring/summer when the sun is centered (Photographers Trail Notes)",
      shotDirection: "West, around 280\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "Ultra wide 11-16mm lens recommended to capture the full view; otherwise, stitching multiple shots is required (Photographers Trail Notes)",
      equipmentNeeded: "Tripod; no other special equipment needed unless performing a panoramic shot (Photographers Trail Notes)",
      permits: "$10 parking fee (Photographers Trail Notes)",
      directions: "The trailhead is 2.3 miles south of the US-89 circle in Page, AZ (near McDonalds). Turn right into the Horseshoe Bend parking lot and follow the well-marked trail to the rim (Photographers Trail Notes)",
      camping: "Page Lake Powell Campground (Photographers Trail Notes)",
      lodging: "Hampton Inn & Suites, Holiday Inn Express, Courtyard (Photographers Trail Notes)",
      restaurants: "Dam Bar & Grille, El Tapatio, Birdhouse (Photographers Trail Notes)",
      cellService: "Full cell service available (tested with Verizon) (Photographers Trail Notes)",
      weather: "Arid climate at over 4,000 ft elevation. Temperatures range from 95\u00b0F in summer to below freezing in winter (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/horseshoe-bend",
      photos: []
    },
    {
      name: "House On Fire",
      nearbyTown: "Blanding",
      state: "Utah",
      region: "Southwest",
      lat: "37.5437722",
      lng: "-109.7446139",
      elevation: "5,990 ft Photographers Trail Notes",
      trailDifficulty: "2.5 (Moderate) Photographers Trail Notes",
      bestTimeOfDay: "Morning on a sunny day, before the sun passes above the ruins. In winter, this is usually until around 11:00 am, and the rest of the year until around noon. Photographers Trail Notes",
      bestTimeOfYear: "Good all year round, as the phenomenon depends on early morning sun reflecting off the adjacent canyon wall. Photographers Trail Notes",
      photographyTips: "Get low and up close to the ruins using a wide-angle lens for distortion. Arrive early to experiment with angles and compositions before the sun blows out the shot. Photographers Trail Notes",
      shotDirection: "East around 105\u00b0 Photographers Trail Notes",
      lensesNeeded: "Wide angle to ultra-wide lenses (e.g., 20mm or 24mm). Photographers Trail Notes",
      equipmentNeeded: "No special equipment needed. A tripod is optional unless performing image blending or HDR. Photographers Trail Notes",
      permits: "Back country permit required ($2 per person), payable at a kiosk at the dirt road entrance off UT 95. Photographers Trail Notes",
      directions: "From Blanding, drive south on US 191 for 3.5 miles and turn right (west) on UT 95. Drive 19.4 miles (just past mile marker 102) and turn right onto CR 263 (Texas Flat Road). Drive 0.3 mile to the pullouts on the right and left of Mule Canyon. Photographers Trail Notes",
      camping: "Blue Mountain Trading Post Photographers Trail Notes",
      lodging: "Stone Lizard Lodging, Super 8 Blanding, Four Corners Inn Photographers Trail Notes",
      restaurants: "Patio Drive In, Homestead Steak House Photographers Trail Notes",
      cellService: "No cell service on the hike (Verizon); limited service at the road (UT 95) and stronger service in Blanding, UT. Photographers Trail Notes",
      weather: "Arid climate with modest temperatures most of the year, but can drop below freezing in winter. Prone to flash floods in the canyon wash during rain. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/house-on-fire",
      photos: []
    },
    {
      name: "Marlboro Point",
      nearbyTown: "Moab",
      state: "UT",
      region: "Southwest",
      lat: "38.4943611",
      lng: "-109.7699444",
      elevation: "5,867 ft (Photographers Trail Notes)",
      trailDifficulty: "4 (Challenging to Difficult) on a 1-5 scale. The road becomes progressively more difficult and requires a high-clearance 4x4 vehicle or a long walk. (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise (preferred) or Sunset. For sunrise, the best light is during the blue hour (10 - 30 minutes before sunrise) and just after sunrise when the first light illuminates the back canyon walls. In winter, a \"spaceship\" effect occurs 20-30 minutes after sunrise. For sunset, wait until the sun is low to avoid harsh light. (Photographers Trail Notes)",
      bestTimeOfYear: "Any time of year. Winter offers potential snow and specific sunrise/sunset angles (sunrise from left front, sunset from right front). Fall and Spring offer sunrise/sunset at 90\u00b0 angles to the shot. Summer is very hot with the sunrise behind the photographer. (Photographers Trail Notes)",
      photographyTips: "Focus on the blue hour for sunrise. Just after sunrise, capture the first light on the canyon walls. In winter, look for the \"spaceship\" effect 20-30 minutes after sunrise. For sunset, late afternoon light illuminates the canyon walls beautifully. (Photographers Trail Notes)",
      shotDirection: "South (approximately 170\u00b0 - 200\u00b0) (Photographers Trail Notes)",
      lensesNeeded: "Wide-angle to telephoto; 17mm equivalent lens mentioned. (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod and a polarizer. (Photographers Trail Notes)",
      permits: "None required (Photographers Trail Notes)",
      directions: "From Moab, drive north on US 191 for 11 miles, then turn left onto UT 313 toward Canyonlands NP. After 7 miles, at the intersection, you can either take UT 313 for 3 miles to Parking A or continue toward Canyonlands. From Parking A, it is a 2-mile drive or walk south to the overlook. (Photographers Trail Notes)",
      camping: "Willow Flat Campground, Kayenta Campground, Horsethief Campsite, Cowboy Campsite (Photographers Trail Notes)",
      lodging: "Red Cliffs Lodge, INCA Inn and Motel, Gonzo Inn (Photographers Trail Notes)",
      restaurants: "Desert Bistro, Twisted Sista's Cafe (Photographers Trail Notes)",
      cellService: "Limited and spotty; not reliable for navigation or emergency calls (Verizon reported). (Photographers Trail Notes)",
      weather: "High desert climate with temperature variations up to 40\u00b0 in a single day. Spring and Fall are generally the most pleasant times to visit. (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/a-light-dusting",
      photos: []
    },
    {
      name: "Mesa Arch",
      nearbyTown: "Moab",
      state: "UT",
      region: "Southwest",
      lat: "38.3878778",
      lng: "-109.8636972",
      elevation: "6,127 ft (Photographers Trail Notes)",
      trailDifficulty: "2 (Moderate) on a 1-5 scale (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise (the arch glows for 1.5 to 2 hours after sunrise) (Photographers Trail Notes)",
      bestTimeOfYear: "Any time of year; in winter months the sun rises to the right of the arch, while from May to July it rises to the left (Photographers Trail Notes)",
      photographyTips: "Use HDR or blending techniques to manage high contrast at sunrise. Compositions include straight on, from the right, left, or panoramas. The arch continues to glow for up to 2 hours after sunrise, which can help avoid crowds (Photographers Trail Notes)",
      shotDirection: "East at approximately 100\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "11-50mm (Photographers Trail Notes)",
      equipmentNeeded: "Tripod; a panoramic tripod head is recommended if planning to shoot panoramas (Photographers Trail Notes)",
      permits: "Canyonlands National Park entrance fee required (valid for 7 days) (Photographers Trail Notes)",
      directions: "Located in the Island in the Sky District of Canyonlands National Park. From Moab, travel northwest on US-191 for 11 miles to the park entrance. Follow the well-marked 0.3-mile trail from the Mesa Arch parking lot to the arch (Photographers Trail Notes)",
      camping: "Willow Flat Campground, Kayenta Campground, Horsethief Campsite, Cowboy Campsite (Photographers Trail Notes)",
      lodging: "Red Cliffs Lodge, INCA Inn and Motel, Gonzo Inn (Photographers Trail Notes)",
      restaurants: "Desert Bistro, Twisted Sista's Cafe (Photographers Trail Notes)",
      cellService: "Limited and spotty cell service (Verizon reported as spotty) (Photographers Trail Notes)",
      weather: "High desert climate with significant temperature variations between seasons (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/mesa-arch",
      photos: []
    },
    {
      name: "Monsoon Storm (Desert View / Navajo Point area)",
      nearbyTown: "Cameron and Grand Canyon Village. Photographers Trail Notes",
      state: "Arizona (AZ). Photographers Trail Notes",
      region: "Southwest",
      lat: "36.040000",
      lng: "-111.822222",
      elevation: "7,364 ft. Photographers Trail Notes",
      trailDifficulty: "1.5 (Moderate) on a scale of 1-5. Requires walking about 100 yards west of the parking lot over assorted rocks. Photographers Trail Notes",
      bestTimeOfDay: "Late afternoon through sunset. Photographers Trail Notes",
      bestTimeOfYear: "Late June to mid-September, with late July to mid-August being the best times. Photographers Trail Notes",
      photographyTips: "Chase the light in specific zones (Eastern, Canyon Village, Hermits Rest, or North Rim). Shoot on a tripod and bracket exposures (e.g., 7 shots at 1-stop intervals) to handle extreme dynamic range. Be patient and look in all directions for unique light. Safety warning: no shot is worth your life during severe weather. Photographers Trail Notes",
      shotDirection: "West about 10-15\u00b0 (facing west to northwest). Photographers Trail Notes",
      lensesNeeded: "Wide-angle to telephoto; the featured image was taken at 77mm. Photographers Trail Notes",
      equipmentNeeded: "Sturdy tripod (for bracketing/compositing) and potentially a lightning trigger. Photographers Trail Notes",
      permits: "Entry fee for Grand Canyon National Park ($35 per vehicle as of July 2024); no other permits required once in the park. Photographers Trail Notes",
      directions: "From Cameron, AZ: Drive south on US89 for 1.4 miles to a traffic circle, then west on AZ-64/Desert View Dr for 30 miles to the East entrance. Turn into Desert View 0.3 miles past the entrance. The trail starts from the RV/Oversize parking lot. From Grand Canyon Village: Take AZ64/Desert View Dr for 22.5 miles to the Desert View turnoff. Photographers Trail Notes",
      camping: "Desert View Campground. Photographers Trail Notes",
      lodging: "Grand Canyon Village (lodges like El Tovar, Bright Angel). Photographers Trail Notes",
      restaurants: "Desert View Trading Post & Ice Cream, Desert View Market & Deli, Cameron Trading Post. Photographers Trail Notes",
      cellService: "Hit or miss at Desert View (tested with Verizon). Photographers Trail Notes",
      weather: "Dramatic storms with powerful cloud formations and unique lighting; potential for lightning and severe weather. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/monsoon-storm",
      photos: []
    },
    {
      name: "Monument Valley (Navajo Tribal Park)",
      nearbyTown: "Kayenta, Arizona (approx. 24 miles southwest) and Mexican Hat, Utah (approx. 20 miles north) (Marty Quinn Photography, Arizona Detours)",
      state: "Arizona / Utah border (Navajo Nation)",
      region: "Southwest",
      lat: "37.00414",
      lng: "-110.09889",
      elevation: "5,564 feet above sea level at the park administration office; approximately 5,201 to 5,339 feet at various photography points like the North Window and main valley overlooks (Navajo Nation Parks, Photographers Trail Notes)",
      trailDifficulty: "Rated as 2 on a 1-5 scale (Easy to Moderate). The main photography points are near the road, but the Valley Drive itself is very bumpy with potholes and deep sand, which can make access challenging (Photographers Trail Notes, Navajo Nation Parks)",
      bestTimeOfDay: "Best for both sunrise and sunset. Sunrise is particularly dramatic at the North Window overlook and the Visitor Center overlook, where the formations catch the first light. Sunset is iconic from the Visitor Center, illuminating the West and East Mitten Buttes and Merrick Butte in warm, golden light. Arrive 15-20 minutes before sunset or sunrise to capture the rapidly moving light (Photographers Trail Notes, Marty Quinn Photography)",
      bestTimeOfYear: "Great to shoot much of the year, though specific shots may be better in certain months. For instance, the main Mittens shot is less ideal in May, June, and July due to the sun's angle, and in December, the sunset can be blocked by a mesa. March, April, September, and October are often recommended for the best sun angles (Photographers Trail Notes)",
      photographyTips: "Focus on the \"Mittens\" (East and West Mitten Buttes) and Merrick Butte. Use leading lines such as the Valley Drive road or desert tracks. Silhouetting formations against colorful skies during sunrise or blue hour is highly effective. Arrive early as light moves quickly across the monuments (Marty Quinn Photography, Photographers Trail Notes)",
      shotDirection: "The iconic shot of the Mittens from the visitor center faces north (around 5\u00b0), though specific locations like Artist's Point face east for sunrise (Photographers Trail Notes, Marty Quinn Photography)",
      lensesNeeded: "Wide-angle to medium telephoto lenses are recommended (24mm to 135mm full-frame equivalent). Specific shots, such as the iconic Mittens view, are often captured with a 50mm lens, while panoramic views from the rim may use 24mm to 94mm (Photographers Trail Notes, Marty Quinn Photography)",
      equipmentNeeded: "A sturdy tripod is essential, especially for sunrise, sunset, and blue hour photography. For night photography, avoid using artificial light sources to illuminate features as it is prohibited. Drones are also prohibited (Photographers Trail Notes, Canyonlands Visitor Guide/NPS)",
      permits: "An entry fee of $20 per vehicle (up to 4 people) is required. Commercial photography requires a special permit. Hiking off the designated Wildcat Trail or visiting restricted areas requires a Navajo guide and often additional permits (Navajo Nation Parks, Marty Quinn Photography)",
      directions: "Located on the Arizona-Utah border within the Navajo Nation, accessed via US Highway 163. It is approximately 24 miles northeast of Kayenta, AZ, and 175 miles from Flagstaff, AZ. The park entrance leads to a 17-mile scenic loop drive (Valley Drive) that takes about 2 hours to complete (Navajo Nation Parks, Marty Quinn Photography)",
      camping: "The View Campground, Goulding's Campground, and Hunts Mesa (overnight camping tours) (The Wandering Queen, Marty Quinn Photography)",
      lodging: "The View Hotel (inside the park), Goulding's Lodge (just outside), and accommodations in the nearby town of Kayenta (Marty Quinn Photography, Arizona Detours)",
      restaurants: "The View Restaurant, Goulding's Stagecoach Restaurant, and various dining options in Kayenta (Yelp, Marty Quinn Photography)",
      cellService: "Cell service is generally poor or non-existent within the more remote parts of the valley, and users are advised not to rely on it (Canyonlands Visitor Guide/NPS, Photographers Trail Notes)",
      weather: "Semi-arid desert climate with hot summers and cold winters. Monsoon season (summer) can lead to rough terrain and deep sand on the valley roads. High winds in the spring can kick up dust, affecting visibility and equipment (Navajo Nation Parks, Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/monument-valley",
      photos: []
    },
    {
      name: "Muley Point",
      nearbyTown: "Mexican Hat",
      state: "UT",
      region: "Southwest",
      lat: "37.2323056",
      lng: "-109.9742222",
      elevation: "6,211 Ft. (Photographers Trail Notes)",
      trailDifficulty: "2.5 (Moderate to Challenging) (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise or sunset (sunrise is preferred) (Photographers Trail Notes)",
      bestTimeOfYear: "April to August (Photographers Trail Notes)",
      photographyTips: "Arrive the afternoon before to explore compositions. Sunrise is recommended to illuminate the purple rocks of Monument Valley. Use of vertical panoramas is suggested to capture detail in both the foreground canyons and distant red rocks (Photographers Trail Notes)",
      shotDirection: "South by southwest (around 190\u00b0) (Photographers Trail Notes)",
      lensesNeeded: "24 mm to 80 mm; vertical panoramas can be shot at 94 mm (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod and pano equipment (Photographers Trail Notes)",
      permits: "No permits are required (Photographers Trail Notes)",
      directions: "From Mexican Hat, drive east on US-163 N for 3.9 miles, then turn left onto UT-261 and continue for about 9 miles. After reaching the top of the Moki Dugway, continue for 300 yards and turn left onto the dirt road toward Muley Point. Drive to the fork and take the left road for a quarter mile to reach the cliff's edge (Photographers Trail Notes)",
      camping: "Popular for RVs and campers (Photographers Trail Notes)",
      lodging: "None listed (Photographers Trail Notes)",
      restaurants: "None listed (Photographers Trail Notes)",
      cellService: "Spotty (Photographers Trail Notes)",
      weather: "High desert climate with temperature fluctuations of 30-40 degrees. Pleasant in spring and fall, hot in summer. Dirt roads become impassable when wet or muddy (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/muley-point",
      photos: []
    },
    {
      name: "NORTH WINDOW OVERLOOK",
      nearbyTown: "Monument Valley (closest town is Kayenta, 26 miles south)",
      state: "AZ",
      region: "Southwest",
      lat: "36.9570028",
      lng: "-110.07065",
      elevation: "5,339 Ft. Photographers Trail Notes",
      trailDifficulty: "2 (Moderate)",
      bestTimeOfDay: "Sunrise is preferred for the soft red glow, which lasts for approximately 30 seconds as the light moves quickly. Sunset is also an option, though the scene is reversed. Photographers Trail Notes",
      bestTimeOfYear: "Any time of year, with clouds and interesting weather providing better conditions. Photographers Trail Notes",
      photographyTips: "The sunrise light moves very quickly and the ideal shot only lasts about 30 seconds. Pick your composition and camera settings before the sun clears the horizon. Photographers Trail Notes",
      shotDirection: "340\u00b0 (North). Photographers Trail Notes",
      lensesNeeded: "24mm. Photographers Trail Notes",
      equipmentNeeded: "Tripod (no special equipment unless shooting a panorama). Photographers Trail Notes",
      permits: "No photography permits required, but there is a $20 daily fee to enter the Monument Valley Navajo Tribal Park. Photographers Trail Notes",
      directions: "From the Monument Valley Navajo visitors\u2019 center, take the \"Valley Drive\" dirt road into the valley floor. Follow the road to station #10, \"North Window.\" Turn into the small dirt parking area and take the trail to the right for about 75 yards to find your composition. Photographers Trail Notes",
      camping: "The View Mitten Campground, Goulding's Campground",
      lodging: "The View Hotel, Goulding's Lodge",
      restaurants: "The View Restaurant, The Swingin Steak, Goulding's Stagecoach Dining",
      cellService: "Limited cell service (tested with Verizon). Photographers Trail Notes",
      weather: "Arid desert environment with an elevation of approximately 5,200ft. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/north-window",
      photos: []
    },
    {
      name: "Point Imperial",
      nearbyTown: "Grand Canyon North Rim (closest services at Jacob Lake, AZ) (Photographers Trail Notes)",
      state: "Arizona",
      region: "Southwest",
      lat: "36.278974",
      lng: "-111.977659",
      elevation: "8,803 ft (National Park Service, Photographers Trail Notes)",
      trailDifficulty: "1.5 (Easy) - The overlook is a very short, paved walk from the parking area (Photographers Trail Notes, Anne's Travels)",
      bestTimeOfDay: "Sunrise/Dawn (National Park Service, Photographers Trail Notes)",
      bestTimeOfYear: "Mid-May to mid-October (when the North Rim is open) (Photographers Trail Notes, National Park Service)",
      photographyTips: "Focus on the soft morning light hitting Mt. Hayden and the Painted Desert. Use a tripod for sharp images in low light. GND filters are recommended to manage the high contrast between the bright horizon and the deep canyon shadows (Photographers Trail Notes, Airial Travel)",
      shotDirection: "Northeast/East (towards Mt. Hayden and the Painted Desert) (National Park Service, Marty Quinn Photography)",
      lensesNeeded: "Ultra-wide angle (11-16mm) for grand vistas and telephoto (70-200mm or longer) for detail shots of Mt. Hayden and distant peaks (Photographers Trail Notes, Airial Travel)",
      equipmentNeeded: "Tripod, Graduated Neutral Density (GND) filters, remote shutter release, and warm clothing due to elevation (Photographers Trail Notes, Loaded Landscapes)",
      permits: "National Park Entrance Fee is required. No special photography permits are needed for personal use, but a Backcountry Permit is required for overnight stays below the rim (National Park Service)",
      directions: "From the North Rim Entrance Station, drive south for 9.6 miles. Turn left on the road for Point Imperial and Cape Royal. After 5.4 miles, turn left toward Point Imperial and drive 2.7 miles to the end of the road (Anne's Travels)",
      camping: "North Rim Campground, DeMotte Campground, Jacob Lake Campground (Tripadvisor, Photographers Trail Notes)",
      lodging: "Grand Canyon Lodge (North Rim), Kaibab Lodge, Jacob Lake Inn (Tripadvisor, Expedia)",
      restaurants: "Grand Canyon Lodge Dining Room, Grand Canyon Lodge Deli, Kaibab Lodge Restaurant, Jacob Lake Inn (Tripadvisor, Photographers Trail Notes)",
      cellService: "Spotty to non-existent; some service may be available near the lodge or specific high points (Photographers Trail Notes, DPReview Forums)",
      weather: "High elevation results in much cooler temperatures than the South Rim. Summer monsoons (July-September) bring frequent afternoon thunderstorms and lightning risks. The area is closed during winter due to heavy snow (National Park Service, Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/point-imperial",
      photos: []
    },
    {
      name: "Sedona Magic (Cathedral Rock)",
      nearbyTown: "Sedona",
      state: "AZ",
      region: "Southwest",
      lat: "34.8370044",
      lng: "-111.8217306",
      elevation: "4,353 Ft. Photographers Trail Notes",
      trailDifficulty: "1 (EASY) on a 1-5 scale. Photographers Trail Notes",
      bestTimeOfDay: "Late afternoon toward sunset. Shot was taken at 7:23 pm on a day when sunset was 7:41 pm. Photographers Trail Notes",
      bestTimeOfYear: "Any time of year. Summer provides sun setting from behind for direct illumination. Shot taken Aug 14th. Photographers Trail Notes",
      photographyTips: "In summer, sun sets directly behind for direct illumination of red rocks. Choose composition and wait for light. May need to composite red rocks and sky for high dynamic range. Photographers Trail Notes",
      shotDirection: "Southeast, around 125\u00b0. Photographers Trail Notes",
      lensesNeeded: "143mm or similar telephoto lens recommended; Cathedral Rocks are 2 miles away. Photographers Trail Notes",
      equipmentNeeded: "Sturdy tripod for shooting around sunset or dusk. Photographers Trail Notes",
      permits: "No permits required. Photographers Trail Notes",
      directions: "Lover's Knoll along Upper Red Rock Loop Rd. From Sedona: head south on N State Rte 89A toward Forest Rd. Photographers Trail Notes",
      camping: "None mentioned. Photographers Trail Notes",
      lodging: "None mentioned. Photographers Trail Notes",
      restaurants: "Sedona has options, but none specifically recommended. Photographers Trail Notes",
      cellService: "Good at this location. Photographers Trail Notes",
      weather: "High desert climate; 4,600 ft elevation. Temperatures can vary 30\u00b0 - 40\u00b0 a day. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/sedona-magic",
      photos: []
    },
    {
      name: "Sentinel Sunrise",
      nearbyTown: "Springdale",
      state: "Utah (UT) Photographers Trail Notes",
      region: "Southwest",
      lat: "37.2185",
      lng: "-112.9756",
      elevation: "4,736 ft Photographers Trail Notes",
      trailDifficulty: "2 (Moderate) on a 1-5 scale. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise (First sunlight illuminating the canyon walls). The guide notes the featured image was taken approximately 45 minutes after the official sunrise to allow light to crest the eastern peaks. Photographers Trail Notes",
      bestTimeOfYear: "Year-round, though the sunrise position varies by season: directly behind the photographer in spring and fall, from the right in summer, and from the left in winter. Photographers Trail Notes",
      photographyTips: "Arrive several minutes before sunrise to find your composition. Be patient, as the light constantly changes and often improves as the sun rises higher (up to 45 minutes post-sunrise). The shot faces west to capture the glow on the east-facing walls of The Sentinel. Photographers Trail Notes",
      shotDirection: "West (facing The Sentinel) Photographers Trail Notes",
      lensesNeeded: "Ultra-wide angle lenses recommended; the featured shot was taken at 16mm. Photographers Trail Notes",
      equipmentNeeded: "Tripod (for low-light sunrise shots), wide-angle lens, and potentially ND filters for long exposures. Photographers Trail Notes",
      permits: "Standard park entrance fee required. Special permits are generally not needed for still photography groups of 8 or fewer people not using props/sets. NPS",
      directions: "Located \"off the beaten path\" in Zion National Park. Access requires a short scramble either uphill or downhill from the parking area to reach a clearing with an unobstructed view of The Sentinel. Photographers Trail Notes",
      camping: "South Campground, Watchman Campground. Zion National Park",
      lodging: "Zion Lodge, various hotels in Springdale, UT. Zion National Park",
      restaurants: "Various options in Springdale, including Oscar's Cafe, Bit & Spur Restaurant & Saloon, and Zion Canyon Brew Pub. Tripadvisor",
      cellService: "Generally spotty or unreliable in the canyon area, typical for Zion's backcountry and off-path locations. NPS",
      weather: "Standard high desert climate; expect cool mornings and potentially hot days. Sudden storms can occur, especially in monsoon season. Zion National Park",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/sentinel-sunrise",
      photos: []
    },
    {
      name: "Sunrise over the Chisos Mountains",
      nearbyTown: "Terlingua (or Panther Junction/Park HQ)",
      state: "Texas",
      region: "Southwest",
      lat: "29.3694",
      lng: "-103.1675",
      elevation: "3,125 Ft. Photographers Trail Notes",
      trailDifficulty: "1 (EASY). The walk from the parking area is approximately 0.1 miles on flat desert terrain. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise. Arrive at least 45 minutes before sunrise (around 5:00 AM) to capture the blue hour and scout for foreground elements. Photographers Trail Notes",
      bestTimeOfYear: "Year-round, though spring and fall offer the most comfortable temperatures. Summer can be extremely hot, while winter mornings can be below freezing. Big Bend NPS",
      photographyTips: "Focus on a 'foreground, midground, background' composition. Use animal paths as leading lines and look for healthy cacti or the Hannold gravesite for foreground interest. Arrive early for the blue hour to see the sky transform into multicolor patterns before the sun lights up the peaks. Photographers Trail Notes",
      shotDirection: "South to Southwest (towards the Chisos Mountains from the Hannold gravesite). Based on Park Geography",
      lensesNeeded: "Wide-angle lens (16-35mm) to capture the full mountain range, or mid-range lenses (24-105mm). The featured image was taken at 29mm. Photographers Trail Notes",
      equipmentNeeded: "Sturdy tripod, polarizer, headlamp or flashlight for navigating in the dark, plenty of water, and sun protection. Photographers Trail Notes",
      permits: "National Park Entry Fee ($30 per vehicle); Backcountry Permit ($10) required for overnight camping at Hannold Draw. NPS",
      directions: "The location is 4.8 miles north of Panther Junction on Route 11 (towards Persimmon Gap). The turnoff is an unmarked gravel road on the east side between mile markers 4 and 5. Follow the short 0.25-mile access road to the parking area/campsite. NPS",
      camping: "Hannold Draw (HD-1) NPS",
      lodging: "Chisos Mountains Lodge NPS",
      restaurants: "Chisos Mountains Lodge Dining Room NPS",
      cellService: "Spotty to non-existent; cell service is difficult or impossible to find in this area of the park. Russ on the Road",
      weather: "Chihuahuan Desert climate; extreme temperature swings are common. Mornings can be very cold (e.g., 23\u00b0F in March), while midday temperatures soar. Summer monsoons can bring sudden thunderstorms. NPS",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/sunrise-over-the-chisos-mountains",
      photos: []
    },
    {
      name: "Sunset Arch",
      nearbyTown: "Escalante",
      state: "Utah",
      region: "Southwest",
      lat: "37.3739",
      lng: "-111.0478",
      elevation: "Approximately 4,500 - 4,600 feet. Girl on a Hike",
      trailDifficulty: "2.5 (Moderate) on a scale of 1-5. Photographers Trail Notes",
      bestTimeOfDay: "Sunset (the arch glows brilliant orange) and night photography (dark skies). Photographers Trail Notes, Action Photo Tours",
      bestTimeOfYear: "Spring through Fall. Photographers Trail Notes",
      photographyTips: "Position yourself to make the arch appear large and elongated with the mountains centered beneath it. Use test shots to refine composition while waiting for the setting sun to illuminate the arch in orange light. Bracketing is recommended for high dynamic range. Photographers Trail Notes, Firefall Photography",
      shotDirection: "Westward, facing the mountains as the sun sets. Photographers Trail Notes",
      lensesNeeded: "24mm (preferred), wide-angle (16-35mm), and telephoto (70-300mm) for compression. Photographers Trail Notes, Action Photo Tours",
      equipmentNeeded: "Tripod, circular polarizer, and neutral density filters. Action Photo Tours",
      permits: "No special permits required for day use; however, backcountry camping requires a free self-issue permit from GSENM. HikeArizona",
      directions: "From Escalante, head east on Highway 12 for 6 miles, then south on Hole-in-the-Rock Road for 36 miles. Turn left onto Forty Mile Ridge Road and drive 4.3 miles to the Water Tank trailhead. The arch is located about 1-1.1 miles south/southwest across the desert terrain. Girl on a Hike, Photographers Trail Notes",
      camping: "Dispersed camping along Hole-in-the-Rock Road, Escalante RV Park, or backcountry camping by arrangement. Action Photo Tours, RoadTripRyan",
      lodging: "Hotels and lodging available in Escalante, UT. Action Photo Tours",
      restaurants: "Restaurants located in Escalante, UT. Action Photo Tours",
      cellService: "Available at the location. Facebook Group",
      weather: "Roads can become impassable when wet or muddy; extreme heat and lack of shade in summer months. Photographers Trail Notes, Firefall Photography",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/sunset-arch",
      photos: []
    },
    {
      name: "Temple of the Sun",
      nearbyTown: "Caineville, Utah (Photographers Trail Notes)",
      state: "Utah",
      region: "Southwest",
      lat: "38.454778",
      lng: "-111.191917",
      elevation: "5,431 ft (Photographers Trail Notes), though Wikipedia lists the summit at 5,822 ft (Wikipedia))",
      trailDifficulty: "Moderate to Challenging (Rated as 'Moderate to Challenging' by source; other similar trails on site are rated around 2.5-3.0 on a 1-5 scale) (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise (preferred for the angle of the formation and sidelight from the first light of the day) or Sunset (Photographers Trail Notes)",
      bestTimeOfYear: "Spring and fall (March to June and September to October) offer milder temperatures and less chance of dangerous monsoon rains or snow (Charlies Wanderings)",
      photographyTips: "Position yourself to the right (west) of Glass Mountain at the turnaround for a sunrise shot when the light hits the Temple of the Sun. Both formations (Sun and Moon) are about 500 yards apart and can be included in compositions (Photographers Trail Notes). Experiment with angles and perspectives to capture shadow and sunlight interplay (Charlies Wanderings)",
      shotDirection: "The formation is typically shot from the west (near Glass Mountain) looking East/Northeast to capture the sunrise light (Photographers Trail Notes). The Sun rises at an azimuth of approx. 90-110\u00b0 depending on the season (Time and Date)",
      lensesNeeded: "43mm lens used to include both Temple of the Sun and Moon while making the Sun appear larger (Photographers Trail Notes). General landscape lenses (wide to mid-range) are recommended",
      equipmentNeeded: "High-clearance vehicle (4x4 suggested), offline maps (Google Maps), food, water, and gas (Photographers Trail Notes, Charlies Wanderings)",
      permits: "None mentioned for access, but a park entrance fee or pass is required for Capitol Reef National Park (NPS). Backcountry permits may be needed for overnight stays outside campgrounds",
      directions: "From Hanksville, drive on UT-24 for 18.2 miles to Cathedral Rd. Drive 16 miles on Cathedral Rd, then turn left on Temple of the Moon Rd. After 1.2 miles, turn slightly right toward Glass Mountain and drive 0.3 miles to a turnaround (Photographers Trail Notes)",
      camping: "Cathedral Valley Campground, BLM land nearby (Park Ranger John, Charlies Wanderings)",
      lodging: "Capitol Reef Resort, Days Inn Capitol Reef, Broken Spur Inn & Steakhouse (Park Ranger John)",
      restaurants: "Broken Spur Steakhouse (Park Ranger John). Other options in nearby Torrey",
      cellService: "Non-existent/none (Park Ranger John, Charlies Wanderings)",
      weather: "Extreme temperatures (scorching summers, cold winters) and sudden rainfall/monsoons that can make roads impassable. Roads can be sandy, bumpy, or have slick rock (Charlies Wanderings, Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/temple-of-the-sun",
      photos: []
    },
    {
      name: "The Crack (also known as The Chute)",
      nearbyTown: "Virgin or Springdale",
      state: "Utah (UT)",
      region: "Southwest",
      lat: "37",
      lng: "113",
      elevation: "5,287 ft. Photographers Trail Notes",
      trailDifficulty: "4.5 on a scale of 1-5 (Hard). Photographers Trail Notes",
      bestTimeOfDay: "Noon or later (when the sun is blocked and glare is reduced). Photographers Trail Notes",
      bestTimeOfYear: "Any time of year as long as water flow is not too light or heavy; Fall is favored for adding colorful maple leaves. Photographers Trail Notes",
      photographyTips: "The rock is extremely slick due to micro algae; use a shutter speed of 1/2 second or longer for silky water; shooting straight down may require a high tripod position or horizontal extension to keep legs out of the frame. Photographers Trail Notes",
      shotDirection: "North by Northeast @ 60\u00b0. Photographers Trail Notes",
      lensesNeeded: "24-50mm (must focus close); 16-35mm can cover all shots (Subway, Archangel Falls, and The Crack). Photographers Trail Notes",
      equipmentNeeded: "Tripod (horizontal extension suggested), polarizer, neutral density filter, waders/wet shoes, walking stick/trek poles, small broom. Photographers Trail Notes",
      permits: "Required: Left Fork North Creek (Subway) permit. Must be reserved and then picked up in person at Zion Visitor Center. Photographers Trail Notes",
      directions: "From Springdale, UT: Take UT 9 west 12 miles to Virgin. Turn right (north) on Kolob Terrace Rd for 9 miles to the Left Fork trailhead parking lot. Hike northeast 0.5 mile to a steep 500ft descent, then follow the creek north for 3.3 miles. Photographers Trail Notes",
      camping: "South Campground, Watchman Campground. Photographers Trail Notes",
      lodging: "South Campground, Watchman Campground (Names of nearby lodging specifically mentioned on the PTN site for this location). Photographers Trail Notes",
      restaurants: "Zion Outfitter, Zion Guru (Nearby services mentioned on PTN site). Photographers Trail Notes",
      cellService: "No cell or internet service in the canyon or even at the lodge. Tripadvisor Photographers Trail Notes",
      weather: "Check for flash flood and thunderstorm risks; avoid hiking when water flow is too heavy. Tripadvisor Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-crack",
      photos: []
    },
    {
      name: "The Heavens Opened (Mather Point)",
      nearbyTown: "Grand Canyon Village, Arizona (Photographers Trail Notes)",
      state: "Arizona",
      region: "Southwest",
      lat: "36.061700",
      lng: "-112.107700",
      elevation: "7,080 Ft. (Photographers Trail Notes)",
      trailDifficulty: "1 (EASY). The location is a short, paved walk from the parking area (Photographers Trail Notes)",
      bestTimeOfDay: "Late afternoon and sunset, particularly as storm fronts pass through the canyon, providing dramatic light and \"crepuscular rays\" (Rob Strain Photography)",
      bestTimeOfYear: "Winter (December through February), when snowfall and clearing storms create unique photographic opportunities (Photographers Trail Notes)",
      photographyTips: "Shoot from the railed overlooks near Mather Point to capture the broad 180-degree view. Look for \"crepuscular rays\" (god rays) as sun breaks through storm clouds. The scene is best when parts of the canyon are selectively illuminated by low-angle light (Photographers Trail Notes)",
      shotDirection: "Northwest to Southwest (225\u00b0 - 315\u00b0) towards the setting sun and storm fronts (Rob Strain Photography)",
      lensesNeeded: "Telephoto lenses ranging from 100mm to 300mm. The featured image was taken at 215mm on a crop sensor (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod, warm clothing/gloves for winter conditions, microspikes or traction devices if trails are icy, and a headlamp for returning after sunset (Photographers Trail Notes)",
      permits: "No specific photography permit is required for personal use on the rim trails. A standard Grand Canyon National Park entrance fee is required (National Park Service)",
      directions: "The location is near Mather Point on the South Rim of Grand Canyon National Park. From the Grand Canyon Visitor Center, follow the short, paved path towards the rim to reach the Mather Point overlooks (Photographers Trail Notes)",
      camping: "Mather Campground, Trailer Village RV Park (National Park Service)",
      lodging: "El Tovar Hotel, Yavapai Lodge, Bright Angel Lodge, Kachina Lodge, Thunderbird Lodge, Maswik Lodge (Grand Canyon National Park Lodges)",
      restaurants: "El Tovar Dining Room, Arizona Steakhouse, Bright Angel Fountain, Maswik Food Court, Yavapai Lodge Restaurant (Grand Canyon National Park Lodges)",
      cellService: "Generally good and reliable in Grand Canyon Village and near the Mather Point overlook area (National Park Service)",
      weather: "Cold winter conditions with potential for snow and ice. High desert climate with significant temperature swings. Storm fronts are common and provide the best photographic drama (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-heavens-opened",
      photos: []
    },
    {
      name: "The Narrows",
      nearbyTown: "Springdale",
      state: "Utah",
      region: "Southwest",
      lat: "37.2850",
      lng: "-112.9482",
      elevation: "4,515 Ft. (Photographers Trail Notes)",
      trailDifficulty: "3 (Moderate to Difficult) on a scale of 1-5 (Photographers Trail Notes)",
      bestTimeOfDay: "The best time to shoot is when colorful reflective light bounces off the sandstone walls, which changes throughout the day as the sun moves across the sky (Photographers Trail Notes). Optimal lighting for \"glowing\" walls typically occurs between 10:00 AM and 4:00 PM (Nathan St. Andre Photography), specifically around 3 hours after sunrise or 3 hours before sunset (Improve Photography)",
      bestTimeOfYear: "Photography is viable year-round, but the best times are late June through July and September when water levels are lower and temperatures are warmer (Best Time 2 Travel). The trail is frequently closed during spring runoff from late March until mid-May (Best Time 2 Travel)",
      photographyTips: "Focus on capturing the colorful reflective light on the canyon walls. Get as low to the water as possible to create depth in your compositions. Always double-check your footing before moving, as the \"bowling ball\" sized rocks are slippery and water can damage electronics (Photographers Trail Notes). Shade your lens from overhead light to prevent lens flare (TrailGroove Magazine)",
      shotDirection: "Various; typically looking upriver (North/Northeast) to follow the canyon's natural curves and light (Zion Guru)",
      lensesNeeded: "Primarily wide-angle lenses (16mm \u2013 35mm) to capture the towering walls (Photographers Trail Notes). A mid-range zoom (24-70mm) is also recommended for details (Adorama)",
      equipmentNeeded: "Sturdy tripod (essential for long exposures in flowing water), polarizer, remote shutter release, waterproof dry bags, neoprene footwear/waders, and a walking stick or trekking poles for stability (Adorama, TrailGroove Magazine)",
      permits: "No permit is required for the \"bottom-up\" day hike from the Temple of Sinawava. However, permits are required for the 16-mile \"top-down\" through-hike starting from Chamberlain\u2019s Ranch (National Park Service)",
      directions: "Take the Zion Canyon Shuttle to the final stop at the Temple of Sinawava. From there, hike the one-mile paved Riverside Walk to the end of the sidewalk where you enter the Virgin River to begin the hike into The Narrows (National Park Service)",
      camping: "Watchman Campground, South Campground, Lava Point Campground (National Park Service)",
      lodging: "Zion National Park Lodge, Desert Pearl Inn, Best Western Plus Zion Canyon Inn & Suites, Cable Mountain Lodge, Cliffrose Springdale, Bumbleberry Inn, Hampton Inn & Suites Springdale (Tripadvisor)",
      restaurants: "Red Rock Grill, Castle Dome Caf\u00e9, Zion Canyon Brew Pub, Oscar's Cafe, Bit & Spur Restaurant & Saloon, Whiptail Grill, Pizza & Noodle (Tripadvisor)",
      cellService: "Cell service is extremely limited or non-existent within the deep sections of the canyon (National Park Service)",
      weather: "High desert climate with significant temperature variations. High risk of dangerous flash floods during summer monsoon season (July-August). Water remains cold year-round, ranging from 45\u00b0F to 55\u00b0F in shoulder seasons (Best Time 2 Travel, TrailGroove Magazine)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-narrows",
      photos: []
    },
    {
      name: "The Overlook (Moonscape Overlook)",
      nearbyTown: "Hanksville",
      state: "Utah",
      region: "Southwest",
      lat: "38.451611",
      lng: "-110.837956",
      elevation: "4,653 Ft (Photographers Trail Notes)",
      trailDifficulty: "Moderate (2.5/5 scale). The drive involves rough dirt roads, but the walk from the parking area to the shot location is only about 25 yards (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise is preferred for the red glow on the side walls just as the sun crests the horizon (Photographers Trail Notes). Drone shots are also excellent about an hour before sunset as shadows create exploding patterns on the valley floor (Photographers Trail Notes)",
      bestTimeOfYear: "Year-round, though April through September is best for the red glow on the side walls (Photographers Trail Notes). In winter, the sun rises in the southeast, which can result in shooting directly into the sun (Photographers Trail Notes)",
      photographyTips: "Arrive at least 30 minutes before sunrise to scout compositions (Photographers Trail Notes). Look for angles that include the side walls as they begin to illuminate (Photographers Trail Notes). Exposure blending in post-processing may be necessary as the sky and walls peak at different times (Photographers Trail Notes). Drone photography is highly recommended for unique aerial patterns (Photographers Trail Notes)",
      shotDirection: "Southeast, approximately 150\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "Ultra-wide to standard lenses (11mm to 50mm combination). Many shots are taken around 16mm or 24mm (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod, polarizer, headlamp or flashlight for early morning or twilight shoots (Photographers Trail Notes). A tilt/shift lens can be useful to compensate for the keystone effect when pointing down at the valley floor (Photographers Trail Notes)",
      permits: "None required at this time (Photographers Trail Notes)",
      directions: "From Hanksville, travel west 10.6 miles on UT-24 to Coal Mine Rd (6650 East). Turn right and travel 6.1 miles to BLM 0913. Turn right and follow this dirt road East for 2.7 miles to the overlook (Photographers Trail Notes). BLM 0931 is noted as a better, more packed alternative road to the same location (Photographers Trail Notes)",
      camping: "Small campsite at the overlook/turnaround, Duke's Slickrock Campground & RV Park, Red Rock Restaurant and Campground, and Cathedral Valley Campground (Photographers Trail Notes, Tripadvisor)",
      lodging: "Whispering Sands Motel, Muddy Creek Mining Company (cabins), Duke's RV Park, and Cathedral Valley Inn in Caineville (Photographers Trail Notes, Tripadvisor)",
      restaurants: "Duke\u2019s Slickrock Grill, Stan's Burger Shak, Outlaw\u2019s Roost, and Red Rock Restaurant (Photographers Trail Notes, Oceanus Adventure)",
      cellService: "Generally poor and sketchy in the desert landscape (CapitolReefCountry). It is spotty at the overlook itself, with the strongest signal found on a small hill to the left (Facebook). Signals improve significantly as you approach Hanksville (Photographers Trail Notes)",
      weather: "High desert climate with daily temperature swings of 30-40\u00b0F. Summers can reach the high 90s, while spring and fall are more temperate. Dirt roads to the location can become impassable when wet or muddy (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-overlook",
      photos: []
    },
    {
      name: "The Spire (also known as Long Dong Silver)",
      nearbyTown: "Hanksville",
      state: "Utah",
      region: "Southwest",
      lat: "38.394056",
      lng: "-110.832333",
      elevation: "5,411 ft (Photographer's Trail Notes)",
      trailDifficulty: "2.5 on a 1-5 scale (Moderate). The hike is about a mile from the BLM post with loose dirt and some elevation gain at the end (Photographer's Trail Notes)",
      bestTimeOfDay: "Late afternoon is the best time for photography as it provides strong light and deep shadows, creating a perfect mood for the scene. Sunset is also an option when the sky is colorfully illuminated and the area is no longer in direct sunlight. Golden or blue hour requires extra processing. Sunrise is a poor option because a tall ridge behind the formation causes the scene to be washed out by the time the sun crests it (Photographer's Trail Notes)",
      bestTimeOfYear: "Late spring, summer, and early fall are recommended, as this is when the sun sets in the northwest. At other times of the year, the sun sets to the left or directly in front of the formation (Photographer's Trail Notes)",
      photographyTips: "Stay to the left (by the ridge) when walking up to the shooting location to avoid creating footprints in the shot. The best location for the shot is on a ridge spine to the northeast, above the Spire. Be aware that the area is extremely fragile and has been heavily impacted by foot traffic, making \"clean\" shots challenging without post-processing (Photographer's Trail Notes)",
      shotDirection: "Southwest, approximately 250\u00b0 (Photographer's Trail Notes)",
      lensesNeeded: "Lenses ranging from 24mm to 50mm are recommended; a common focal length for the shot is around 35mm (Photographer's Trail Notes)",
      equipmentNeeded: "A sturdy tripod, a lens hood to protect against flare, and a flashlight or headlamp for hiking back in the dark if shooting at sunset (Photographer's Trail Notes)",
      permits: "No permits are required (Photographer's Trail Notes)",
      directions: "From Hanksville, drive west on UT-24. After crossing the Fremont River, drive approximately 6.0 to 7.2 miles to an unmarked and unmaintained dirt road heading north. Follow the tracks for 0.5 miles to a fork, turn left (west) for 0.5 miles, then turn right (north) for another 0.5 miles to a BLM post that restricts further driving. From the BLM post, hike north for about 0.5 to 1 mile through a wide opening in the ridges to reach the formation (Photographer's Trail Notes, Oceanus Adventure)",
      camping: "Duke's Slickrock Campground & RV Park (Photographer's Trail Notes)",
      lodging: "Muddy Creek Mining Company, Whispering Sands Motel (Photographer's Trail Notes)",
      restaurants: "Duke's Slickrock Grill, Stan's Burger Shak, Outlaw's Roost (Photographer's Trail Notes)",
      cellService: "Cell service is spotty (reported on Verizon), with stronger signals available closer to the town of Hanksville (Photographer's Trail Notes)",
      weather: "The area has a high desert climate with temperatures varying 30-40 degrees daily. Summer temperatures can reach the high 90s. Avoid the area if it has recently rained or snowed, as the dirt turns into impassable mud that will trap any vehicle (Photographer's Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-spire",
      photos: []
    },
    {
      name: "The Subway (Left Fork of North Creek)",
      nearbyTown: "Virgin",
      state: "Utah",
      region: "Southwest",
      lat: "37.3091",
      lng: "-113.0522",
      elevation: "5,357 ft (Photographers Trail Notes)",
      trailDifficulty: "4.5/5 (Hard/Strenuous) due to off-trail boulder scrambling and significant elevation changes (Photographers Trail Notes)",
      bestTimeOfDay: "Best between 11:00 AM and 1:00 PM when reflected light is most effective in the canyon (MishMoments). Alternative recommendations suggest 3 hours after sunrise or 3 hours before sunset (Improve Photography)",
      bestTimeOfYear: "Early to mid-November is ideal for autumn foliage (Action Photo Tours). November through March offers the best chance for obtaining permits (Firefall Photography)",
      photographyTips: "Rocks are extremely slick and dangerous; use a tripod for shutter speeds often exceeding one second. Use a circular polarizer to manage reflections on water and wet rocks. Reflected light is superior to direct sunlight. Be aware that the Subway room has no dry space to set down gear (Photographers Trail Notes)",
      shotDirection: "Direction is generally considered not important due to the enclosed nature of the slot canyon (Photographers Trail Notes)",
      lensesNeeded: "A 16-35mm wide-angle lens is recommended as a single-lens solution. A 24mm lens is common for specific shots, and wider lenses or multi-shot panoramas are useful in the confined Subway room (Photographers Trail Notes)",
      equipmentNeeded: "Tripod (essential for long exposures), circular polarizer, dry bags, neoprene socks, water boots, and a GPS for route finding (Photographers Trail Notes)",
      permits: "A Zion Wilderness Permit is required year-round for all hikers. Access is limited to 80 people per day via a lottery system (Recreation.gov)",
      directions: "From Hurricane, UT, drive 13 miles to Virgin and turn onto Kolob Terrace Road. Drive approximately 8.2 miles to the Left Fork Trailhead. The hike involves a 0.5-mile trek to the canyon rim, a 400-500 foot descent, and a 3.5-mile upstream scramble through the creek (Girl on a Hike)",
      camping: "Watchman Campground, South Campground, Lava Point Campground (NPS)",
      lodging: "Zion Lodge, Under Canvas Zion, Zion's Camp and Cottages (Tripadvisor)",
      restaurants: "Pig's Ear American Bistro, Embers, Stage Coach Grille, Red Fort Cuisine of India, Main Street Cafe (Tripadvisor)",
      cellService: "Minimal to none; phones often enter SOS mode deep within the canyon (Facebook)",
      weather: "High flash flood risk; always check water conditions and weather forecasts before entry. Spring runoff in April can make the route treacherous (NPS)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-subway",
      photos: []
    },
    {
      name: "The Watchman",
      nearbyTown: "Springdale",
      state: "UT",
      region: "Southwest",
      lat: "37.217528",
      lng: "-112.975039",
      elevation: "4,024 Ft Photographers Trail Notes",
      trailDifficulty: "2 (Moderate on a 1-5 scale) Photographers Trail Notes",
      bestTimeOfDay: "Sunset is the classic time to shoot when the late sun paints the red glow on the right side of The Watchman. Sunset is recommended to capture the peak light on the mountain Photographers Trail Notes",
      bestTimeOfYear: "The Watchman can be photographed in spring, summer, or fall, but the very best time is in the fall when the trees along the Virgin River turn golden yellow Photographers Trail Notes",
      photographyTips: "Composition is straightforward from the bridge pointing south. Due to extreme dynamic range between the foreground brush and bright sky, HDR techniques or filters are recommended. Be patient and wait for the late glow on the peaks. Note: The bridge has limited space (10-15 photographers) and high traffic, including shuttle buses. Additionally, there is a notice that Zion National Park has decided to close the Watchman bridge to photography Photographers Trail Notes",
      shotDirection: "South @ 180\u00b0 Photographers Trail Notes",
      lensesNeeded: "Wide angle lens (16mm \u2013 35mm). EXIF data from the sample image shows a focal length of 24mm Photographers Trail Notes",
      equipmentNeeded: "Tripod. A tilt/shift lens may be useful to compensate for the keystone effect while shooting from the bridge Photographers Trail Notes",
      permits: "Admission into Zion National Park is required, but no additional photography permits are needed for this location Photographers Trail Notes",
      directions: "Located just north of Springdale, UT, inside Zion National Park. Photographers shoot from a small, narrow bridge over the Virgin River. You can reach the bridge by driving and parking (limited availability, Canyon Community Center recommended) or by taking the park shuttle Photographers Trail Notes",
      camping: "South Campground, Watchman Campground, Zion River Resort Photographers Trail Notes",
      lodging: "Desert Pearl Inn, Cable Mountain Lodge, Hampton Inn & Suites Springdale Photographers Trail Notes",
      restaurants: "The Spotted Dog, Oscar's Cafe, Cafe Soleil Photographers Trail Notes",
      cellService: "Verizon cell service is available at the overlook Photographers Trail Notes",
      weather: "Zion experiences a wide range of weather; summer temperatures can exceed 100\u00b0F Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-watchman",
      photos: []
    },
    {
      name: "The Wave (Coyote Buttes North)",
      nearbyTown: "Kanab, Page",
      state: "Arizona",
      region: "Southwest",
      lat: "36.9960",
      lng: "-112.0062",
      elevation: "5,210 Ft. (Photographers Trail Notes)",
      trailDifficulty: "4.5 out of 5. The hike is roughly 6 miles round-trip over deep sand, steep slickrock, and uneven terrain with significant exposure and no shade (Photographers Trail Notes)",
      bestTimeOfDay: "The best time to photograph The Wave is around midday (when the sun is directly overhead) to capture the formation without shadows. However, early morning (1-2 hours before sunrise) is recommended to capture side light entering the bowl and to avoid the extreme heat. Blue Hour and early morning light also provide excellent conditions for reflections in the \"Wave Slot\" and for shots looking south at the entrance (Photographers Trail Notes)",
      bestTimeOfYear: "The Wave can be photographed year-round. Spring and Fall offer the most pleasant weather, though permits are more competitive. Summer features extreme heat but may have higher permit availability. Winter is the least favorable due to low sun angles casting long shadows and the potential for snow covering the formations (Photographers Trail Notes)",
      photographyTips: "The 'Classic Wave' shot is taken from the south side of the bowl facing northwest. For reflections, arrive early to be the first at the entrance to avoid footprints in standing water. The 'Wave Slot' offers brilliant reflective light in the early morning; shoot wide and low for the best effect. Astrophotography is also excellent due to the remote location's dark skies (Photographers Trail Notes)",
      shotDirection: "The approximate direction for the 'Classic Wave' shot is 315\u00b0 (Northwest) (Photographers Trail Notes)",
      lensesNeeded: "Ultra-wide-angle lens (14-20mm) for the classic Wave composition. A standard to wide-angle lens (24-50mm) is recommended for capturing abstracts and smaller sandstone formations (Photographers Trail Notes)",
      equipmentNeeded: "Tripod, headlamp (for early starts), 3-4 quarts of water, snacks, head covering, and sturdy hiking shoes. GPS tracking software with a downloaded KML file is highly recommended to prevent getting lost (Photographers Trail Notes)",
      permits: "A mandatory permit from the Bureau of Land Management (BLM) is required. Permits are issued via a lottery system (Advance and Daily) on Recreation.gov (Photographers Trail Notes)",
      directions: "From Kanab, UT, drive east on US-89 for 40 miles to House Rock Valley Rd, then 10.3 miles south to the Wire Pass Trailhead. From Page, AZ, drive west on US-89 for 34 miles to House Rock Valley Rd and 10.3 miles south. High-clearance vehicles are recommended as the road can become impassable when wet (Photographers Trail Notes)",
      camping: "Stateline Campground (Bearfoot Theory). Note: Overnight camping is strictly prohibited within the Coyote Buttes North permit area (Photographers Trail Notes)",
      lodging: "Kanab (UT), Page (AZ) (Photographers Trail Notes)",
      restaurants: "Kanab (UT), Page (AZ) (Photographers Trail Notes)",
      cellService: "There is generally no cell service at The Wave. Verizon users may occasionally find a signal by climbing the surrounding high hills (Photographers Trail Notes)",
      weather: "High desert climate with temperature fluctuations of up to 30\u00b0F in a single day. Summer temperatures can exceed 100\u00b0F. Monsoon season in late summer can bring violent, brief thunderstorms (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/the-wave",
      photos: []
    },
    {
      name: "The Witch's Hat (Coyote Buttes South)",
      nearbyTown: "Kanab",
      state: "Arizona",
      region: "Southwest",
      lat: "36.96387",
      lng: "-111.98960",
      elevation: "5,783 ft (Photographers Trail Notes)",
      trailDifficulty: "4 (Challenging to Hard) on a scale of 1-5 (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise and sunset are generally considered the best times for this location, as noted by Jim Zuckerman and general South Coyote Buttes guides. The Photographers Trail Notes preview mentions that the appearance changes depending on the angle and suggests taking time to explore different compositions",
      bestTimeOfYear: "All seasons except for the extreme heat of summer are recommended. Action Photo Tours notes that winter can be particularly interesting due to ice patches adding detail to images",
      photographyTips: "The ideal spot for capturing the Witch's Hat is a separate rock formation about 15 feet away and of similar height. Climbing to the top and looking down helps eliminate the gap between the rock and the ground. The formation's appearance changes significantly with the viewing angle, so exploration is encouraged (Photographers Trail Notes)",
      shotDirection: "The shot is often taken looking down from a neighboring southern rock formation, suggesting a generally northward or northwestward shot direction to capture the formation's profile (Photographers Trail Notes)",
      lensesNeeded: "Wide-angle lenses are recommended; the featured image on the site was captured at 16mm (Photographers Trail Notes)",
      equipmentNeeded: "High-clearance 4x4 vehicle with large, wide tires and a tire pressure gauge to lower pressure to 15-20 psi for deep sand (Photographers Trail Notes)",
      permits: "A Coyote Buttes South permit is required, which is obtained through a BLM lottery (Photographers Trail Notes, PhotoHound)",
      directions: "The drive is challenging to hard, requiring a high-clearance 4x4 vehicle with large, wide tires due to deep sand and unmarked roads. It is recommended to lower tire pressure to 15-20 psi. From the Coyote Buttes South parking area, the hike is approximately 1 mile, with the first 3/4 mile being sandy and strenuous (Photographers Trail Notes)",
      camping: "Overnight camping is available at nearby Stateline Campground or via dispersed camping on BLM land (membership required for specific site recommendations on Photographers Trail Notes)",
      lodging: "Nearby lodging is primarily located in Kanab, UT, including Best Western East Zion Thunderbird Lodge, Canyons Lodge, East Zion Resort, and Comfort Suites Kanab",
      restaurants: "Various restaurants are available in nearby Kanab, such as Rocking V Cafe and other local eateries (TripAdvisor)",
      cellService: "Cell service is generally unavailable in the remote Coyote Buttes South area; visitors are advised to prepare accordingly by using offline maps and telling someone their plans (Utah Guide)",
      weather: "Avoid the extreme heat of summer. Winter can be very cold and windy, with ice patches possible after storms (Action Photo Tours)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/witchs-hat",
      photos: []
    },
    {
      name: "Thor's Hammer (Photographers Trail Notes)",
      nearbyTown: "Bryce (Lat Long Finder)",
      state: "Utah (Lat Long Finder)",
      region: "Southwest",
      lat: "37.6234",
      lng: "-112.1654",
      elevation: "7,870 Ft (Photographers Trail Notes)",
      trailDifficulty: "1-2 on a scale of 1-5; easy walk but can be dicey or icy in winter (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise (Photographers Trail Notes), consistent with Derek Nielsen Photography",
      bestTimeOfYear: "Winter months for dramatic colors and snow (Photographers Trail Notes), though summer provides pleasant, cool mornings (Derek Nielsen Photography)",
      photographyTips: "Manage extreme dynamic range by bracketing exposures or using composites. The formation glows intensely for 3-5 minutes as the sun hits it. For the best composition, position the 'Hammer' to break the horizon (Photographers Trail Notes, Nathaniel Young)",
      shotDirection: "95\u00b0 (East-Southeast for sunrise) (Locationscout)",
      lensesNeeded: "Wide-angle to standard lenses (approx. 40mm equivalent) are recommended to capture the hammer with its surroundings (Photographers Trail Notes, NJ Productions)",
      equipmentNeeded: "Sturdy tripod, neutral density or graduated filters for dynamic range, warm layered clothing (puffy coat), water, and sun protection (Derek Nielsen Photography, James Suits Photography)",
      permits: "National Park entry fee required; special use permits are necessary for commercial filming and photography groups (National Park Service)",
      directions: "Park at Sunset Point and follow the Navajo Loop Trail for a short descent (about 400 yards). The formation is reached after approximately 4 switchbacks, about a 10-15 minute walk from the rim (NJ Productions, Photographers Trail Notes)",
      camping: "Sunset Campground, North Campground (The Wandering Lens, James Suits Photography)",
      lodging: "The Lodge at Bryce Canyon (NPS)",
      restaurants: "The Lodge at Bryce Canyon Dining Room, Valhalla Pizzeria (NPS)",
      cellService: "Spotty or poor cell phone reception within the canyon (Instagram), with some better reception reported near specific high points (Facebook Hiking Utah Group)",
      weather: "High elevation leads to extreme cold at night and in winter; temperatures can drop significantly even in August. Snow and ice are common from late fall through spring (James Suits Photography, NJ Productions)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/thors-hammer",
      photos: []
    },
    {
      name: "Three Sisters Sunset (Photographers Trail Notes)",
      nearbyTown: "Apache Junction (Gold Canyon area)",
      state: "Arizona",
      region: "Southwest",
      lat: "33.393333",
      lng: "-111.375000",
      elevation: "2,642 Ft (Photographers Trail Notes)",
      trailDifficulty: "2 (Easy) on a 1-5 scale (Photographers Trail Notes)",
      bestTimeOfDay: "Sunrise and sunset provide the most compelling lighting, with sunset offering side lighting into the canyon and on the formation's cliff faces (Photographers Trail Notes)",
      bestTimeOfYear: "Anytime of year offers compelling opportunities, though extreme summer heat and the monsoon season (which can make roads impassable) are factors to consider (Photographers Trail Notes)",
      photographyTips: "Focus on compositions that include cacti in the foreground using wide-angle lenses. The location is excellent for focus stacking and panoramic shots. Sunset provides excellent side lighting on the formation's cliff faces (Photographers Trail Notes)",
      shotDirection: "Northwest (approximately 320\u00b0) (Photographers Trail Notes)",
      lensesNeeded: "Wide angle (16-24mm) for cacti foregrounds, macro lenses for cacti details, and 24-70mm or 24-105mm for general images and panoramas (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod, appropriate headgear, water, snacks, and potentially knee-high leg gators or snake boots due to cacti and snakes (Photographers Trail Notes)",
      permits: "Arizona State Land Department Permit required (Photographers Trail Notes)",
      directions: "From Phoenix, take US-60 east to Apache Junction, turn east on Peralta Road, and follow it for 5.6 miles. Take the left fork onto East Peralta Road for 0.5 miles to the Carney Springs trailhead. Hike north 0.6 miles to a trail junction, then west 0.6 miles along the wilderness boundary to the old 4WD turnaround area (Photographers Trail Notes)",
      camping: "Dispersed camping along East Peralta Road, Peralta Road Dispersed Camping, Lost Dutchman State Park Campground (The Dyrt)",
      lodging: "Best Western Gold Canyon Inn & Suites, Gold Canyon Golf Resort, Gold Canyon RV & Golf Resort, Superstition Lookout RV Resort, Superstition Sunrise RV Resort (Tripadvisor)",
      restaurants: "Gold Canyon Cafe, Kokopelli's, De La Cruz, The Prospector, Chen's Chinese Bistro, Rosati's Pizza, Gold Stallion Restaurant, Oldie's Ice Cream, Ginza Sushi Fusion Cuisine (Tripadvisor)",
      cellService: "Reception is spotty in the area (Verizon), but improves as you drive back toward Phoenix (Photographers Trail Notes)",
      weather: "The dirt road to the trailhead can become impassable after rain, especially during monsoon season. Summertime temperatures can be extreme, and snakes are present in warmer months (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/three-sisters-sunset",
      photos: []
    },
    {
      name: "Toroweap (also known as Tuweep)",
      nearbyTown: "Kanab",
      state: "AZ",
      region: "Southwest",
      lat: "36.2143861",
      lng: "-113.0566056",
      elevation: "4,631ft (Photographers Trail Notes)",
      trailDifficulty: "5 (on a 1-5 scale) (Photographers Trail Notes)",
      bestTimeOfDay: "Sunset and Sunrise. Sunset offers views to the west, while sunrise provides views to the east/northeast (Photographers Trail Notes)",
      bestTimeOfYear: "For sunset, the sun should set directly down the canyon or slightly to the north. For sunrise, the sun should rise to the right (south) of the canyon (around 70\u00b0 - 85\u00b0). Clouds are considered essential for a great shot (Photographers Trail Notes)",
      photographyTips: "Sunset shots are best taken from the rock ledge overlooking the canyon. Sunrise shots are best taken about 50 yards east of the sunset location. Clouds are necessary for the best results, and the location is not recommended for those afraid of heights (Photographers Trail Notes)",
      shotDirection: "Sunset: West @ 240\u00b0; Sunrise: East by North East @ 55\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "16mm \u2013 50mm (Photographers Trail Notes)",
      equipmentNeeded: "Tripod and a high clearance 4-wheel drive vehicle (Photographers Trail Notes)",
      permits: "Requires a standard NPS Park/Site Pass plus either a Day Use Ticket or a Backcountry Permit (for overnight stays). Permits must be obtained online at least 5 days in advance (Photographers Trail Notes)",
      directions: "From Kanab, UT, drive south on US-89 for 7 miles to Fredonia, then turn right (west) onto AZ-389. The journey involves a long drive on gravel and dirt roads, with the final section being extremely rough (Photographers Trail Notes)",
      camping: "Tuweep Campground (Photographers Trail Notes)",
      lodging: "None nearby; the closest lodging is in Kanab, UT (Photographers Trail Notes)",
      restaurants: "None nearby; the closest options are in Kanab, UT (Photographers Trail Notes)",
      cellService: "No cell service once you leave the highway (Photographers Trail Notes)",
      weather: "Arid Arizona desert climate at 4,000 feet elevation; roads can become impassable when wet (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/toroweap",
      photos: []
    },
    {
      name: "Twilight Near Mather Point",
      nearbyTown: "Grand Canyon Village, AZ Photographers Trail Notes",
      state: "Arizona Photographers Trail Notes",
      region: "Southwest",
      lat: "36.06165",
      lng: "-112.10794",
      elevation: "7,000 Ft. Photographers Trail Notes",
      trailDifficulty: "1 (Easy) Photographers Trail Notes",
      bestTimeOfDay: "The location is best photographed just before and/or just after the sun sets (twilight) according to Photographers Trail Notes. Sunrise is also highly recommended for direct eastern light GrandCanyon.com",
      bestTimeOfYear: "Every day of the year Photographers Trail Notes, though late fall, winter, and early spring are preferred to avoid large crowds Photographers Trail Notes",
      photographyTips: "Timing is critical; the fading sun provides a soft warm glow that reduces extreme dynamic range Photographers Trail Notes. Pastel colors pop during the first few minutes after sunset. To avoid crowds, walk 50-200 yards east of the main Mather Point Overlook along the Rim Trail Photographers Trail Notes. Bracketing exposures (-2, 0, +2 EV) is recommended GrandCanyon.com",
      shotDirection: "The overlook provides a 300+ degree view; specific shots of Bright Angel Canyon from this area generally face North/Northwest NPS.gov, Photographers Trail Notes",
      lensesNeeded: "Anything from super-wide to telephoto; the example shot was taken with a 24mm lens Photographers Trail Notes",
      equipmentNeeded: "Tripod for long exposures, protective lens filters (UV or Polarizer), and lens cleaning supplies (microfiber cloth and blower) Photographers Trail Notes, GrandCanyon.com",
      permits: "Grand Canyon National Park entrance fee is required; no additional permits are needed for standard non-commercial photography Photographers Trail Notes",
      directions: "Located on the Rim Trail, approximately 350 yards from the Grand Canyon Visitor Center and 100 yards from the parking lot (Lots 1-4) Photographers Trail Notes, GrandCanyon.com",
      camping: "Mather Campground TripAdvisor",
      lodging: "El Tovar Hotel, Yavapai Lodge, Bright Angel Lodge TripAdvisor",
      restaurants: "El Tovar Dining Room, Arizona Steakhouse, Yavapai Lodge Restaurant TripAdvisor",
      cellService: "Generally available near the Grand Canyon Visitor Center and Grand Canyon Village GrandCanyon.com",
      weather: "Canyon weather varies; twilight shooting reduces extreme dynamic range Photographers Trail Notes. Snowy conditions can significantly transform the scene Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/twilight-near-mather-point",
      photos: []
    },
    {
      name: "Upper Antelope Canyon (The Crack / Ts\u00e9 bigh\u00e1n\u00edl\u00edn\u00ed)",
      nearbyTown: "Page",
      state: "Arizona (AZ)",
      region: "Southwest",
      lat: "36.930364",
      lng: "-111.408125",
      elevation: "4,158 ft. Photographers Trail Notes",
      trailDifficulty: "3 (Moderate) on a scale of 1-5. Difficulty is mainly due to crowd stress; the path is level and short (approx. 1/4 mile). Photographers Trail Notes",
      bestTimeOfDay: "Winter months: early morning for the back of the canyon, mid day to afternoon for the middle and front. Summer months: almost the reverse. Best for light beams: 11:30 a.m. to 1:00 p.m. (May to October). Photographers Trail Notes, Authentik USA",
      bestTimeOfYear: "Year-round; light beams are best from May through August (or March to October). Photographers Trail Notes, Paul Reiffer",
      photographyTips: "Expect dark conditions requiring 2-10 second exposures. Use high ISO for test shots to scout formations. Colors may appear different to the camera (Kelvin temperatures). Look up for unique water carvings and textures. Protect gear from destructive micro-sandstone dust. Photographers Trail Notes, Paul Reiffer",
      shotDirection: "The whole time you are in the canyon you will be out of the sun. (Specific degree direction not provided, but canyon runs generally north-south). Photographers Trail Notes",
      lensesNeeded: "Ultra wide to standard zoom lenses (e.g., 16-35mm or 24-70mm). Carry only one lens to avoid changing in the dusty canyon. Photographers Trail Notes",
      equipmentNeeded: "Protective lens filter (UV or Polarizer), micro lens cloths, blower, snacks, water/Gatorade, and a bag/rag to protect camera from fine sand. Tripods are no longer allowed on standard tours (since July 2018). Photographers Trail Notes",
      permits: "No individual permits required, but you MUST be accompanied by a Navajo guide on a booked tour. Photographers Trail Notes",
      directions: "From Page: Head east on AZ 98 for 2.2 miles, take a right on Indian Rte. 222 (just before the power plant), then turn right on a dirt road to the parking lot. Access is via a guided tour. Photographers Trail Notes",
      camping: "Page Lake Powell Campground. Photographers Trail Notes",
      lodging: "Hampton Inn & Suites, Holiday Inn Express, Courtyard by Marriott, Into the Grand. Photographers Trail Notes",
      restaurants: "Dam Bar & Grille, Fiesta Mexicana, El Tapatio, Birdhouse, Into the Grand. Photographers Trail Notes",
      cellService: "No cell service inside the slot canyons; service available at the parking lot (Verizon mentioned). Photographers Trail Notes",
      weather: "Monsoon season (July-September) brings flash flood risks; never ignore warnings. Temperatures can be very high in summer. Canyons are darker and cooler than the surface. Photographers Trail Notes, Visit Arizona",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/upper-antelope-canyon",
      photos: []
    },
    {
      name: "WAHWEAP SUNRISE",
      nearbyTown: "Big Water",
      state: "UT",
      region: "Southwest",
      lat: "37.1625",
      lng: "-111.7123056",
      elevation: "4,298 Ft. (Photographers Trail Notes)",
      trailDifficulty: "4 out of 5 (Challenging to Difficult) (Photographers Trail Notes)",
      bestTimeOfDay: "Early morning, specifically 30 minutes after stated sunrise when the sun crests the ridge to the east (Photographers Trail Notes)",
      bestTimeOfYear: "Mid-April is recommended for the correct light angle on the back wall; avoid summer due to extreme heat (Photographers Trail Notes)",
      photographyTips: "Use a sturdy tripod, check focus, and be ready for the fast-moving light as it hits the hoodoos about 30 minutes after sunrise. Exposure bracketing (1-3 stops) is recommended to manage the contrast between hoodoos and the back wall (Photographers Trail Notes)",
      shotDirection: "South, around 190\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "24-105 mm focal lengths; the primary shot was taken at 48mm (Photographers Trail Notes)",
      equipmentNeeded: "Sturdy tripod, 4 quarts of liquid (water/Gatorade recommended), and light packing for the 9-mile round trip hike (Photographers Trail Notes)",
      permits: "No permits required as of August 2022 (Photographers Trail Notes)",
      directions: "From Big Water, UT, take Ethan Allen road for 0.6 miles, turn left on Fish Hatchery Rd, and travel 2.3 miles to a small parking area. From there, hike 4.25 miles (9.5 miles round trip) up the Wahweap wash (Photographers Trail Notes)",
      camping: "Grand Staircase Escalante National Monument land (dispersed camping allowed) (Photographers Trail Notes)",
      lodging: "None listed on page (Photographers Trail Notes)",
      restaurants: "Dam Bar & Grille, El Tapatio, Birdhouse (all in Page, AZ) (Photographers Trail Notes)",
      cellService: "No cell service at the hoodoos (Verizon tested); service is available in Big Water or Page (Photographers Trail Notes)",
      weather: "High desert climate with temperature variations of 40-50\u00b0 daily; extreme heat in summer (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/wahweap-sunrise",
      photos: []
    },
    {
      name: "White Pocket",
      nearbyTown: "Kanab, Page",
      state: "Arizona",
      region: "Southwest",
      lat: "36.955011",
      lng: "-111.893296",
      elevation: "5,944 Ft. Photographers Trail Notes",
      trailDifficulty: "5 (Hard to Extreme) Photographers Trail Notes",
      bestTimeOfDay: "Sunrise, sunset, and night (astrophotography). Arriving 3\u20135 hours before sunset is recommended to scout locations before the light changes quickly Photographers Trail Notes",
      bestTimeOfYear: "Late summer (August) is ideal for capturing water in potholes during monsoon season Action Photo Tours. Milky Way photography is best from March through October Firefall Photography",
      photographyTips: "Scout 3\u20135 hours before sunset to identify compositions. Use an ultra-wide lens to accentuate 'brain rock' textures and leading lines. Seek out water-filled potholes after rains for perfect reflections. Focus stacking is recommended for maintaining sharpness from near-foreground to infinity. Night photography is world-class due to the Bortle 1 dark sky status Photographers Trail Notes Firefall Photography",
      shotDirection: "Opportunities exist in all directions; no set primary direction Photographers Trail Notes",
      lensesNeeded: "Ultra-wide (14mm\u201317mm) for sweeping rock formations and reflections, 24\u201370mm for general compositions, and telephoto (70\u2013200mm) for isolating details and abstracts Photographers Trail Notes Gerlach Nature Photo",
      equipmentNeeded: "High-clearance 4x4 vehicle with off-road tires, portable air compressor (to reinflate tires after airing down), GPS with pre-downloaded trails, tripod, plenty of food and water, head covering, sunscreen, and a dust broom to sweep away footprints/debris Photographers Trail Notes",
      permits: "No permit is currently required for White Pocket Gerlach Nature Photo",
      directions: "From US 89 (between Kanab and Page), take House Rock Valley Road (BLM 1065). Turn onto BLM 1017 (located across from an old corral), then proceed to BLM 1087 and follow BLM 1086 to the trailhead. The final 5 miles consist of deep sand and rocky sections requiring 4x4 high clearance Bureau of Land Management Photographers Trail Notes",
      camping: "White Pocket Trailhead (dispersed/parking lot camping), Stateline Campground Photographers Trail Notes Gerlach Nature Photo",
      lodging: "Kanab (UT), Page (AZ) Photographers Trail Notes",
      restaurants: "Kanab (UT), Page (AZ) Photographers Trail Notes",
      cellService: "None available Photographers Trail Notes",
      weather: "High desert climate with no shade or water. Extremely hot in summer; ice can form in winter. Monsoon rains (July\u2013September) are critical for creating reflection pools Photographers Trail Notes Action Photo Tours",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/white-pocket",
      photos: []
    },
    {
      name: "White Sands",
      nearbyTown: "Alamogordo",
      state: "New Mexico",
      region: "Southwest",
      lat: "32.805575",
      lng: "-106.2736778",
      elevation: "3,972 ft. Photographers Trail Notes",
      trailDifficulty: "3 on a 1-5 scale. Hiking 1-4 miles deep into the dunes is required for the best shots, which can be taxing and disorienting. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise and sunset are the most popular, but it can be photographed any time of day depending on desired effects. Photographers Trail Notes",
      bestTimeOfYear: "Anytime, but winter is recommended for fewer visitors and fewer footprints. Summer temperatures can be extreme and require continuous hydration and sun protection. Photographers Trail Notes",
      photographyTips: "Dunes are made of gypsum, not quartz sand. Unique white color contrasts with mountains and sky. Challenges include relatively low dune height (20-40ft), gaps/valleys between dune rows, fewer S-shapes, and prevalent footprints near accessible areas. Yucca plants and vegetation are common in the dunes. Photographers Trail Notes",
      shotDirection: "All directions. Photographers Trail Notes",
      lensesNeeded: "Lenses ranging from ultra wide to short telephoto. Photographers Trail Notes",
      equipmentNeeded: "GPS or reliable compass (essential), tripod (for low light), polarizer, blower (to clean equipment), hat, sunscreen, water/Gatorade. Photographers Trail Notes",
      permits: "Entry fee of $35 per vehicle (as of Dec 2022). Permits are required for overnight primitive camping (available at the visitor center). After-hours photography can be arranged for a fee ($50/hour in 2018). Photographers Trail Notes",
      directions: "From Alamogordo: Drive southwest on US-70 W/White Sands Blvd for 13.5 miles to Dunes Dr. Turn right; the visitors\u2019 center is directly ahead. Photographers Trail Notes",
      camping: "White Sands Backcountry Primitive Camping. Photographers Trail Notes",
      lodging: "Super 8 Alamogordo, Hampton Inn Alamogordo, Fairfield Inn & Suites Alamogordo. Photographers Trail Notes",
      restaurants: "None listed on the page; park has no food resources. Nearby options are available in Alamogordo. Photographers Trail Notes",
      cellService: "Limited service in White Sands; stronger service is available once back at the main highway. Photographers Trail Notes",
      weather: "Very hot in summer (highs in upper 90s). Fall and spring are mild by day and cold at night. Winters have cool days and nights in the 20s or teens. Temperature can drop 30-40 degrees from mid-day to night. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/white-sands",
      photos: []
    },
    {
      name: "Winter Wonderland (Sunset Point, Bryce Canyon)",
      nearbyTown: "Bryce, UT",
      state: "Utah",
      region: "Southwest",
      lat: "37",
      lng: "112",
      elevation: "8,010 Ft. Photographers Trail Notes",
      trailDifficulty: "1 or 2 (Easy to Moderate) on a scale of 1-5. The walk is only 150 yards but can be dicey/icy in winter. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise and early morning (most viewpoints face eastward). The sidelight on the red hoodoos at sunrise creates a brilliant red glow. Photographers Trail Notes",
      bestTimeOfYear: "Any time of year, but winter (with snow) makes the red hoodoos pop and provides greater depth. The featured \"Winter Wonderland\" image was taken on November 9th. Summer (mid-July to mid-Sept) offers dramatic monsoon weather. Photographers Trail Notes",
      photographyTips: "Focus on sunrise and early morning. Don't stop shooting once the sun hits the floor; it takes minutes to illuminate the amphitheater. Use exposure blending for high dynamic range. Consider 3-frame vertical panoramas to capture detail and correct keystone effects. Arrive 30 minutes before sunrise. Photographers Trail Notes",
      shotDirection: "Most sunrise images are between 30\u00b0 and 70\u00b0. The sun rises in the southeast in winter and northeast in summer. Photographers Trail Notes",
      lensesNeeded: "Medium-wide, standard, or short telephoto (24-100mm). The featured image was a 3-frame vertical pano with a 100mm equivalent lens (80mm on a 35mm camera). Photographers Trail Notes",
      equipmentNeeded: "Sturdy tripod (for image blending), polarizing filter, heavy-duty winter clothes (hat, gloves) for winter visits as temperatures can drop to single digits. Photographers Trail Notes",
      permits: "$35 National Park entrance fee (valid for 7 days), purchased at the gate or visitors' center. No other permits are required once inside the park. Photographers Trail Notes",
      directions: "From Bryce, UT, drive 2.4 miles south on UT-63 S toward the Bryce Canyon National Park entrance. After the entrance, travel 1.4 miles, turn left, and drive 1/4 mile to the Sunset Point viewing area. From the parking lot, walk approximately 150 yards to the viewing area. Photographers Trail Notes",
      camping: "North Campground, Sunset Campground. Photographers Trail Notes",
      lodging: "Abundance of lodging in and around Bryce, UT; BryceCanyon.com is recommended for options. Photographers Trail Notes",
      restaurants: "Several dining establishments in and around Bryce, UT (no specific recommendations provided by the source). BryceCanyon.com is recommended for finding options. Photographers Trail Notes",
      cellService: "Good at most locations along the Bryce Canyon rim and parking areas (tested with Verizon). Very strong service while driving back to the town of Bryce. Photographers Trail Notes",
      weather: "Cooler/colder than other parts of the Southwest due to 8,000 ft elevation. Summer highs in the 70s or low 80s; winter temperatures often drop into the single digits. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/winter-wonderland",
      photos: []
    },
    {
      name: "Zebra Slot Canyon",
      nearbyTown: "Escalante",
      state: "UT",
      region: "Southwest",
      lat: "37.6614556",
      lng: "-111.4173278",
      elevation: "5,183 Ft. (Photographers Trail Notes)",
      trailDifficulty: "3 (on a 1-5 scale) - Challenging due to narrow sections, potential water, and navigational confusion in the last half mile (Photographers Trail Notes)",
      bestTimeOfDay: "Late morning, 2-3 hours after sunrise. Once the sun gets too high, the light in the canyon can be too harsh (Photographers Trail Notes)",
      bestTimeOfYear: "Year-round, but monsoon season (late summer) can cause the entrance to be filled with deep water and pose flash flood risks (Photographers Trail Notes)",
      photographyTips: "The canyon is very narrow; use canyon walls for tripod support. Striped walls are toward the back, where you can also climb up for different perspectives and lighting (Photographers Trail Notes)",
      shotDirection: "Mainly shooting north to south at 180\u00b0 (Photographers Trail Notes)",
      lensesNeeded: "Wide-angle 11-35mm lens (Photographers Trail Notes)",
      equipmentNeeded: "Plenty of snacks, liquids, sunscreen, a good hat, a good tripod, polarizer, and potentially a wet bag for camera equipment if wading through water is required (Photographers Trail Notes)",
      permits: "No permits required in the area, but checking with the Escalante Interagency Visitor Center is recommended (Photographers Trail Notes)",
      directions: "From Escalante, drive 5 miles east on UT12 to Hole in the Rock Rd. Turn right and drive 7.9 miles (past the 3rd cattle guard) to a small unmarked parking area on the right. The unmarked trailhead is directly across the road (Photographers Trail Notes)",
      camping: "Escalante Outfitters, Calf Creek Campground, Deer Creek Campground, and several BLM pullouts on Hole in the Rock Rd (Photographers Trail Notes)",
      lodging: "Entrada Escalante Lodge, Canyon Country Lodge (Photographers Trail Notes)",
      restaurants: "Escalante Outfitters, 4th West Pub (Escalante); Hell\u2019s Backbone Grill & Farm, Burr Trail Grill (Boulder) (Photographers Trail Notes)",
      cellService: "Hit or miss at Zebra Canyon; solid in Escalante (Verizon) (Photographers Trail Notes)",
      weather: "Temperatures can vary by 40\u00b0 in a day. Summer can exceed 100\u00b0F. Monsoon season brings violent thunderstorms and flash flood risks (Photographers Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/american-southwest/zebra-canyon",
      photos: []
    },
    {
      name: "A Little Piece of Heaven",
      nearbyTown: "Ridgway, CO",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,764 Ft.",
      trailDifficulty: "MODERATE (3 on a scale of 1-5)",
      bestTimeOfDay: "Sunrise (suggested for sky and first light on mountains)",
      bestTimeOfYear: "Fall (indicated by site context and fall colors)",
      photographyTips: "Straightforward shot. Explore the area for the best composition, using bushes or shrubs in the foreground for color and depth. For sunrise, consider shooting the sky before the sun hits the mountains and blending it with an image of the first light on the peaks.",
      shotDirection: "",
      lensesNeeded: "24mm lens",
      equipmentNeeded: "4-wheel drive vehicle recommended for the road.",
      permits: "The dirt road (County Road CR9) is public property. However, the land on either side is private property (Double RL Ranch), and trespassing is strictly prohibited.",
      directions: "The location is reached by driving on an old, narrow dirt road near Ridgway, CO (County Road CR9). The road has bumps, holes, and narrow sections, including a sharp, uphill blind S-curve with tall bushes.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Avoid driving on the road if it is wet or muddy, as you are almost guaranteed to get stuck.",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/a-little-piece-of-heaven-photographers-guide",
      photos: []
    },
    {
      name: "Wilson Peak",
      nearbyTown: "Telluride, Ridgway Photographer\'s Trail Notes",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "",
      trailDifficulty: "Easy (rated 1 to 1.5 on a scale of 1-5) Photographer\'s Trail Notes",
      bestTimeOfDay: "Sunrise (mentioned as the \"Best time of day to shoot\" and in the photography tips which suggest being set up before sunrise to capture the light hitting the mountain face) Photographer\'s Trail Notes",
      bestTimeOfYear: "Fall color season, especially after a \"good snow\" which adds texture and dimension Photographer\'s Trail Notes",
      photographyTips: "The shot is best when the sun hits and illuminates the face of the mountain. It is recommended to be set up and prepared to capture the image before sunrise. A \"good snow\" during the fall color season adds significant texture and dimension Photographer\'s Trail Notes",
      shotDirection: "Due South Photographer\'s Trail Notes",
      lensesNeeded: "35-50mm lens or a 105mm equivalent lens for a five-shot vertical panorama Photographer\'s Trail Notes",
      equipmentNeeded: "A vehicle is mentioned as you can stand next to it to capture the shot Photographer\'s Trail Notes",
      permits: "",
      directions: "The shot can be taken directly from the road or by walking up a slight elevation (15-30 ft) some 20 yards above the road to get a different perspective Photographer\'s Trail Notes",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Best after a \"good snow\" during the fall color season Photographer\'s Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/wilson-peak-photographers-guide",
      photos: []
    },
    {
      name: "A Room with a View",
      nearbyTown: "Telluride",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "11,060 ft.",
      trailDifficulty: "MODERATE TO ROUGH (3 on a scale of 1-5). The road is very rocky with potholes; a high clearance vehicle is recommended.",
      bestTimeOfDay: "Morning (The guide mentions miners placed the building to \"take advantage of this incredible view each morning\").",
      bestTimeOfYear: "Fall (implied by image alt text \"Stunning View Colorado Fall Colors\").",
      photographyTips: "Getting the perspective right is the first step. Moving right, left, up, or down through the back window can dramatically change the perspective of the front window, floor, side wall, and the view of Mt. Wilson. The front window is neither straight nor square; tilting the camera to straighten one side will alter others.",
      shotDirection: "Towards Mt. Wilson.",
      lensesNeeded: "50mm to 100mm.",
      equipmentNeeded: "High clearance vehicle (recommended for the rough road).",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/a-room-wtih-a-view-photographers-guide",
      photos: []
    },
    {
      name: "Sneffels Reflection",
      nearbyTown: "Ridgway",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "9,305 Ft.",
      trailDifficulty: "MODERATE (3-5 on a scale of 1-5); simple 300 yard hike from parking area",
      bestTimeOfDay: "Sunrise, sunset, or middle of the day",
      bestTimeOfYear: "Fall color season",
      photographyTips: "Small beaver dam only holds 4-5 people and is not very sturdy. Position yourself to the far right to block potential hunters\' trailers/tents in the fall. Don\'t capture the whole pond; lower position makes reflection more pronounced (Photographers Trail Notes).",
      shotDirection: "",
      lensesNeeded: "40mm lens used for main image",
      equipmentNeeded: "4-wheel drive vehicle recommended",
      permits: "",
      directions: "",
      camping: "Overnight Lodging/Camping",
      lodging: "Overnight Lodging/Camping",
      restaurants: "Nearby Restaurants",
      cellService: "Cell Service",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/sneffels-reflection",
      photos: []
    },
    {
      name: "Chimney Rock from Deb’s Meadow",
      nearbyTown: "Ridgway, CO Photographer\'s Trail Notes",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.1626667",
      lng: "-107.5689444",
      elevation: "9,914 ft. Photographer\'s Trail Notes",
      trailDifficulty: "MODERATE (2 to 5 on a scale of 1-5) Photographer\'s Trail Notes",
      bestTimeOfDay: "Sunset (or just after) Photographer\'s Trail Notes",
      bestTimeOfYear: "Year-round, but best in the Fall (September) Photographer\'s Trail Notes",
      photographyTips: "Position yourself near the small creek at the edge of Deb’s Meadow. The shot is straightforward. Photographer\'s Trail Notes",
      shotDirection: "South @ 180° Photographer\'s Trail Notes",
      lensesNeeded: "Depends on composition; 33mm was used for the example shot Photographer\'s Trail Notes",
      equipmentNeeded: "Sturdy tripod, camera Photographer\'s Trail Notes",
      permits: "None required Photographer\'s Trail Notes",
      directions: "From Ridgway, travel north on US 550 for 1.7 miles to CO RD 10. Turn right on CO RD 10 for 4.0 miles to the fork for CO RD 8, then turn right on CO RD 8. From Deb\'s Meadow, walk west toward the Aspen trees across the Meadow. Photographer\'s Trail Notes",
      camping: "",
      lodging: "Ridgway, CO Photographer\'s Trail Notes",
      restaurants: "Kate’s Places, Gnar, Colorado Boy Pub & Brewery Photographer\'s Trail Notes",
      cellService: "Spotty (Verizon mentioned); better service as you drive toward Ridgway Photographer\'s Trail Notes",
      weather: "Mild in the summer, cold in spring and fall (lows in the 20s) Photographer\'s Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/colorado/chimney-rock-from-debs-meadow",
      photos: []
    },
    {
      name: "The Last Light",
      nearbyTown: "",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,113 Ft.",
      trailDifficulty: "EASY (1 out of 5)",
      bestTimeOfDay: "Just a few moments before sunset, or later in the afternoon on an overcast or cloudy day.",
      bestTimeOfYear: "None specified (member-only content), though the summary mentions golden aspens in the fall in Colorado.",
      photographyTips: "The dunes offer shapes, curves, vistas, and abstracts. Move quickly as the sun dips to capture the best lighting. Shooting from the road allows for easier scanning of compositions, but requires a very long lens to compress the scene and emphasize sunset lighting. Dappled light on overcast days can also produce nice effects.",
      shotDirection: "None specified (member-only content).",
      lensesNeeded: "Extremely long lens with a minimum focal length of 500 mm; 560 mm (400 mm + 1.4x extender) used for the featured shot.",
      equipmentNeeded: "Very sturdy tripod and ball head.",
      permits: "None specified (member-only content).",
      directions: "The road leading into the park provides a vantage point to photograph the dunes from at least a mile away.",
      camping: "None specified (member-only content).",
      lodging: "None specified (member-only content).",
      restaurants: "None specified (member-only content).",
      cellService: "None specified (member-only content).",
      weather: "Overcast or cloudy days can produce dappled light.",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/the-last-light-photographers-guide",
      photos: []
    },
    {
      name: "Enchanted Forest",
      nearbyTown: "Ridgway",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "12,777 Ft.",
      trailDifficulty: "MODERATE (2 on a scale of 1-5; road is bumpy with some rocks and holes)",
      bestTimeOfDay: "Morning (mentioned in summary)",
      bestTimeOfYear: "Fall (mentioned in summary and image titles)",
      photographyTips: "The appearance of the Aspen grove is highly dependent on seasonal rainfall. Weather plays a significant role in the photography; light rain and heavy fog can create a dreamlike, surreal atmosphere. While the shot is straightforward from a photography standpoint, timing it with the right weather and seasonal conditions is key.",
      shotDirection: "",
      lensesNeeded: "50mm lens (recommendations range from 35mm to 100mm)",
      equipmentNeeded: "",
      permits: "",
      directions: "The location is situated in a large Aspen forest in southwest Colorado on a dirt road connecting Ridgway and Owl Creek Pass. It is approximately a half mile from Kate’s Meadow.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "The location\'s condition depends on the amount of rain. Fall storms can bring light rain and heavy fog, which are noted as ideal for the \'enchanted\' look.",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/enchanted-forest-photographers-guide",
      photos: []
    },
    {
      name: "Maroon Bells",
      nearbyTown: "Aspen (Photographer\'s Trail Notes)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "11,251 Ft. (Photographer\'s Trail Notes)",
      trailDifficulty: "Easy (1 on a scale of 1-5). (Photographer\'s Trail Notes)",
      bestTimeOfDay: "Late September morning with first light/sunrise. (Photographer\'s Trail Notes)",
      bestTimeOfYear: "Late September. (Photographer\'s Trail Notes)",
      photographyTips: "Everything needs to line up perfectly for the ideal shot: weather, timing (color and amount of leaves on Aspen trees), recent snow to dust the mountain, no wind for a mirror image on the lake, little or no clouds to avoid blocking the sunrise, and no recent wind storms. (Photographer\'s Trail Notes)",
      shotDirection: "West/Southwest (facing the Maroon Peaks from the lake). (Photographer\'s Trail Notes)",
      lensesNeeded: "Wide angle vista (24-28mm), standard or compression shots (50mm - 200mm). (Photographer\'s Trail Notes)",
      equipmentNeeded: "",
      permits: "",
      directions: "The shot is an easy 300yd. walk from the Maroon Bells parking lot. (Photographer\'s Trail Notes)",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Brisk late September mornings; snow, wind, and clouds are key factors for photography conditions. (Photographer\'s Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/maroon-bells-photographers-guide",
      photos: []
    },
    {
      name: "Dallas Divide",
      nearbyTown: "Ridgway (Visit Ridgway, CO)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.099325",
      lng: "-107.8719222",
      elevation: "8,701 Ft. (Photographer\'s Trail Notes)",
      trailDifficulty: "EASY (1 on a scale of 1-5) (Photographer\'s Trail Notes)",
      bestTimeOfDay: "Sunrise (Photographer\'s Trail Notes)",
      bestTimeOfYear: "Spectacular any time of year, but best in fall (specifically late September) (Photographer\'s Trail Notes)",
      photographyTips: "Arrive early to secure a spot among many photographers. Conditions vary greatly, and perfect light is rare. Multiple views are available along the fence (Photographer\'s Trail Notes).",
      shotDirection: "Mainly due south (between 150 – 210°) (Photographer\'s Trail Notes)",
      lensesNeeded: "Very wide-angle lens (16-24mm) (Photographer\'s Trail Notes)",
      equipmentNeeded: "Tripod; polarizer is rarely used for vistas (Photographer\'s Trail Notes)",
      permits: "No permits required (stay on the road side of the fence) (Photographer\'s Trail Notes)",
      directions: "From Ridgway, travel west on CO HW62 for approximately 8.5 miles to the gravel parking lot (Google Maps)",
      camping: "Ridgway State Park (4 miles north of Ridgway) (CPW Shop)",
      lodging: "Chipeta Solar Springs Resort & Spa, Ridgway-Ouray Lodge & Suites (Photographer\'s Trail Notes)",
      restaurants: "Kate\'s Place, Colorado Boy Pub & Brewery, Gnar (Photographer\'s Trail Notes)",
      cellService: "Good to spotty (Verizon) (Photographer\'s Trail Notes)",
      weather: "Mild in summer, cold in spring and fall (lows in the 20s) (Weather.gov)",
      sourceUrl: "https://photographerstrailnotes.com/other/dallas-divide",
      photos: []
    },
    {
      name: "Spires at Silver Jack",
      nearbyTown: "Ridgway, Cimarron, Montrose (Uncover Colorado, Tripadvisor)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "Approx. 8,763 ft - 9,000 ft (TopoQuest, Uncover Colorado)",
      trailDifficulty: "Easy to Moderate (mostly roadside or short walks to overlooks) (Photographer\'s Trail Notes, Uncover Colorado)",
      bestTimeOfDay: "Late afternoon / Sunset (Photographer\'s Trail Notes)",
      bestTimeOfYear: "Fall (late September to early October) (Photographer\'s Trail Notes)",
      photographyTips: "Look for the jagged rock formations (\'Spiers\') surrounding the reservoir. Use the reservoir as a mirror for reflections. Fall colors (aspens) are a highlight. Arrive early for sunset to find a composition (Photographer\'s Trail Notes, Tripadvisor)",
      shotDirection: "South / Southwest (facing the spires and reservoir from the north/east) (Photographer\'s Trail Notes)",
      lensesNeeded: "Wide-angle to standard zoom (e.g., 24-70mm) (Photographer\'s Trail Notes)",
      equipmentNeeded: "Sturdy tripod, lens hood, hiking boots, warm clothing, flashlight/headlamp (Photographer\'s Trail Notes)",
      permits: "None required for photography; camping fees apply at developed sites (Photographer\'s Trail Notes)",
      directions: "From Ridgway, CO, travel north on US Highway 550 for about 2 miles to County Road 10. Turn onto CR 10 (sign for Owl Creek Pass) and follow it until it intersects County Road 8. Follow CR 8 east over Owl Creek Pass into Gunnison County. Alternatively, from Cimarron, CO, drive south on County Road 858 for approximately 18-20 miles (Ham Radio Answers, Uncover Colorado)",
      camping: "Silver Jack Campground (60 sites, three loops: Chipeta, Ouray, Sapinero) (The Dyrt), Big Cimarron Campground, Beaver Lake Campground (Uncover Colorado)",
      lodging: "Lodging available in Ridgway or Montrose (Tripadvisor)",
      restaurants: "Restaurants available in Ridgway or Montrose (Tripadvisor)",
      cellService: "None/Limited (remote National Forest area) (Photographer\'s Trail Notes)",
      weather: "Mountain climate; cool to cold in fall. Roads can be snowy or muddy in early spring/late fall and are typically closed in winter (Uncover Colorado, Ham Radio Answers)",
      sourceUrl: "https://photographerstrailnotes.com/colorado/spiers-at-silverjack",
      photos: []
    },
    {
      name: "Mt. Sneffels from CR #7",
      nearbyTown: "Ridgway, CO (Photographer\'s Trail Notes)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "9,305 ft. (Photographer\'s Trail Notes)",
      trailDifficulty: "MODERATE (3 to 5 on a scale of 1-5). It is a simple 300-yard hike from the parking area to the small beaver pond (Photographer\'s Trail Notes).",
      bestTimeOfDay: "Sunrise, sunset, or middle of the day (Photographer\'s Trail Notes)",
      bestTimeOfYear: "Fall color season (Photographer\'s Trail Notes)",
      photographyTips: "The location features a small beaver dam that only has room for about 4-5 people and is not very sturdy. It is suggested not to try and capture the whole pond but to position the composition so the pond adds a foreground reflection of the mountain peaks (Photographer\'s Trail Notes). Use a circular polarizer to enhance the blue sky and contrast (Anthony Crouch).",
      shotDirection: "South/Southwest toward the Sneffels Range (Jim Doty).",
      lensesNeeded: "40mm lens was used for the featured reflection shot (Photographer\'s Trail Notes). Long focal length (telephoto) lenses are also recommended (Jim Doty).",
      equipmentNeeded: "A 4-wheel drive vehicle is recommended for the bumpy dirt road (Photographer\'s Trail Notes). Trekking poles and a helmet are recommended for hikers (Debra Van Winegarden).",
      permits: "A permit system has been proposed for the Blue Lakes Trail in the Mount Sneffels Wilderness (The Next Summit). Wilderness regulations apply (SJMA).",
      directions: "From Ridgway, CO, take Highway 62 west for approximately 4.8 miles. Turn left (south) onto County Road 7 (East Dallas Creek Road). Follow CR 7 for about 9 miles to the end of the road and the Blue Lakes Trailhead (SJMA). The drive is bumpy and best traveled with a 4-wheel drive vehicle (Photographer\'s Trail Notes).",
      camping: "Dispersed camping is available near the Lower Trailhead in Yankee Boy Basin (Debra Van Winegarden). No camping is allowed on County Road 7 until reaching the National Forest Boundary (SJMA).",
      lodging: "Available with membership (Photographer\'s Trail Notes)",
      restaurants: "Available with membership (Photographer\'s Trail Notes)",
      cellService: "Available with membership (Photographer\'s Trail Notes)",
      weather: "Fall brings colorful aspens. During periods of heavy rain, the road can become impassable (SJMA). High-altitude weather can change rapidly (Debra Van Winegarden).",
      sourceUrl: "https://photographerstrailnotes.com/colorado/mp-mt-sneffels-from-county-rd-7",
      photos: []
    },
    {
      name: "Silver Jack Sunrise",
      nearbyTown: "Cimarron, Ridgway, Montrose (gjhikes.com) (Mickey Shannon Photography)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,171 - 9,085 feet (gjhikes.com)",
      trailDifficulty: "Easy (access via fishing road or short walk) (gjhikes.com)",
      bestTimeOfDay: "Sunrise (Facebook) (Digital Photography School)",
      bestTimeOfYear: "Autumn / Fall (late September to early October) (Photographers Trail Notes) (Mickey Shannon Photography) (Jim Doty\'s Blog)",
      photographyTips: "Arrive 30-60 minutes before sunrise. Use backlighting to make aspen colors glow. Use a tripod for sharp images in low light. Use a polarizer to reduce haze and enhance color (B&H Explora) (Photography Life) (Facebook)",
      shotDirection: "Likely East/North-East (facing sunrise over mountains) or West for morning light on peaks (Photography Life)",
      lensesNeeded: "Wide angle for grand vistas, telephoto for isolating aspen groves or distant peaks (B&H Explora) (Digital Photography School)",
      equipmentNeeded: "Tripod, polarizing filter (B&H Explora) (Photography Life)",
      permits: "None required for standard access (gjhikes.com)",
      directions: "Drive east from Montrose on Highway 50 for about 20.5 miles, then turn right onto Big Cimarron Road. Follow for 18.6 miles to the Silver Jack Fishing Access (gjhikes.com)",
      camping: "Silver Jack Campground, Beaver Lake Campground, Big Cimarron Campground (gjhikes.com) (Mickey Shannon Photography)",
      lodging: "Ridgway (approx. 1 hour drive) (Mickey Shannon Photography)",
      restaurants: "None immediate; options available in Cimarron, Ridgway, or Montrose (gjhikes.com)",
      cellService: "0 bars / None (gjhikes.com)",
      weather: "Cold mornings, potential for frost or early snow in autumn (Mickey Shannon Photography) (Jim Doty\'s Blog)",
      sourceUrl: "https://photographerstrailnotes.com/colorado/silverjack-sunrise",
      photos: []
    },
    {
      name: "Cimarron Ridge",
      nearbyTown: "Ridgway, CO",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,991 Ft.",
      trailDifficulty: "MODERATE (2 on a scale of 1-5). Description: bumpy with a few rocks and holes along the way.",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "This shot is pretty straight forward. Timing a patients are important to get a good shot with a lit…",
      shotDirection: "",
      lensesNeeded: "This location is a nice place for a panoramic - as the hills, ridge and colors extend for miles. However... (The above image was taken at 60mm.)",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/cimarron-ridge-photographers-guide",
      photos: []
    },
    {
      name: "Hermit\'s Rest",
      nearbyTown: "Near Black Canyon of the Gunnison NP Photographer\'s Trail Notes",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,965 Ft. Elevation Photographer\'s Trail Notes",
      trailDifficulty: "EASY Photographer\'s Trail Notes",
      bestTimeOfDay: "Other Resources Available with Membership",
      bestTimeOfYear: "Other Resources Available with Membership",
      photographyTips: "Walk down the trail 300ft or so and see how you want to frame the shot. There are multiple possibilities. Focus on the water and its reflection, the majestic mountains in the back with just a small view of the other side at the top for depth, and the brilliant Fall colors. Use a circular polarizing filter to reduce glare on the water. Photographer\'s Trail Notes",
      shotDirection: "Other Resources Available with Membership",
      lensesNeeded: "At least a range of 24 to 70mm. (Specifics mentioned: 15mm f/2.4, 21mm f2.4, 24-70mm f2.8, and 70-200mm f2.8) Photographer\'s Trail Notes",
      equipmentNeeded: "Circular polarizing filter Photographer\'s Trail Notes",
      permits: "Other Resources Available with Membership",
      directions: "Other Resources Available with Membership",
      camping: "Other Resources Available with Membership",
      lodging: "Other Resources Available with Membership",
      restaurants: "Other Resources Available with Membership",
      cellService: "Other Resources Available with Membership",
      weather: "Mention of brilliant Fall colors and sun glare at 11:41 am Photographer\'s Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/hermits-rest-photographers-guide",
      photos: []
    },
    {
      name: "Crystal Mill",
      nearbyTown: "Marble",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,897 Ft.",
      trailDifficulty: "EXTREME (5 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "Fall (implied by \"colorful aspens\" and image titles)",
      photographyTips: "A favorite shot is from directly in front of the mill. To eliminate the foreground, you have to sit on a small ridge above the river (falling from this spot would be disastrous/deadly). The distance from the small ridge to the mill is about 100 ft. The mill is higher than the ridge, which creates a keystone effect when pointing up. To capture water movement, use a slower shutter speed (1/2 second or longer), but be aware that Aspen trees behind the mill may move.",
      shotDirection: "",
      lensesNeeded: "24-50mm lens (if shooting from the side); 35mm lens (used for the featured side shot).",
      equipmentNeeded: "A serious 4-wheel off road vehicle is a must, such as a Jeep Rubicon or similar with at least 10\" clearance.",
      permits: "The mill is on private property; as of Fall 2022, the owners were charging $10 - $20 per person (based on photography setup) to photograph inside the rope boundary.",
      directions: "Located about 5 miles east of Marble, CO. The location is accessible by walking 5.6 miles each way, driving a high-clearance 4-wheel drive vehicle, or by horseback. The road is extremely difficult and narrow with high points and large rocks. Jeep tours and ATV rentals are available in Marble.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/crystal-mill-photographers-guide",
      photos: []
    },
    {
      name: "Owl Creek Watercolors",
      nearbyTown: "Ridgway, Cimarron (4X4Explore)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.1583258",
      lng: "-107.5622816",
      elevation: "Approx. 10,114 feet (Uncover Colorado)",
      trailDifficulty: "Easy to Moderate; mostly roadside or short walks (Aaron Reed Photography)",
      bestTimeOfDay: "Late afternoon and sunset (Facebook), sunrise (Photographer\'s Trail Guides)",
      bestTimeOfYear: "Fall (late September to early October) for peak foliage (Facebook), Summer to October (Uncover Colorado)",
      photographyTips: "Use a polarizer to manage reflections on water and enhance foliage colors (Kurt Budliger). Experiment with shutter speeds (1/4 sec to several seconds) to capture water texture (Kurt Budliger). Look for reflections in the creek and use leading lines from the water flow (Kurt Budliger).",
      shotDirection: "East toward Chimney Rock and the Cimarron Ridge (4X4Explore)",
      lensesNeeded: "Wide-angle for vistas, 70-200mm telephoto for compression (Facebook)",
      equipmentNeeded: "Tripod, polarizer (Kurt Budliger), dependable vehicle (SUV/4x4 recommended) (Mike Putnam)",
      permits: "None mentioned for public land access; some areas may be private (4X4Explore)",
      directions: "From Ridgway, head north on US-550 for 1.8 miles, turn right on County Road 10, then turn right on County Road 8 (Owl Creek Pass road) (4X4Explore)",
      camping: "Dispersed camping along the road; Silver Jack, Beaver Lake, and Big Cimarron campgrounds (4X4Explore)",
      lodging: "The Peaks Resort & Spa (Telluride), Outlook Lodge (Green Mountain Falls - distant), or hotels in Ridgway (Aaron Reed Photography)",
      restaurants: "Dining options available in Ridgway (Ridgway Visitors Guide)",
      cellService: "Variable/Limited in the mountains (Photographer\'s Trail Guides)",
      weather: "Crisp and cool in fall (Roads Less Traveled), subject to snow as early as October (4X4Explore)",
      sourceUrl: "https://photographerstrailnotes.com/colorado/owl-creek-watercolors",
      photos: []
    },
    {
      name: "Sunset Dune",
      nearbyTown: "",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "xxx Ft.",
      trailDifficulty: "MODERATE to CHALLENGING (rated 2 on a scale of 1-5)",
      bestTimeOfDay: "Sunset (arriving 2 hours before)",
      bestTimeOfYear: "",
      photographyTips: "Look for abstracts or moods created by curves and shadows; prefer a sky with no clouds; explore both up and down the dunes; identify unique shapes as dunes shift due to wind",
      shotDirection: "Facing down the dunes, pointing downhill from a higher dune",
      lensesNeeded: "Standard lens or a medium telephoto; the featured image was taken with a 180mm equivalent lens",
      equipmentNeeded: "Tripod (visible in site photography)",
      permits: "",
      directions: "Roughly a mile hike from the parking area",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Dunes are constantly shifting due to wind; overcast lighting can be flat with no contrast",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/gsdnp-sunset-photographers-guide",
      photos: []
    },
    {
      name: "Ferns on Kebler Pass",
      nearbyTown: "Crested Butte Photographer\'s Trail Notes",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,750 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "EASY TO MODERATE (2 on a scale of 1-5) Photographer\'s Trail Notes",
      bestTimeOfDay: "",
      bestTimeOfYear: "Fall colors season Photographer\'s Trail Notes",
      photographyTips: "Explore off the beaten path during the fall color season. When photographing aspens, walk around and look in all directions (up, down, and behind you). Look for groves with healthy ferns mixed with white-trunk trees. Compositions can sometimes be found in unexpected places, such as when looking up from the ground. Photographer\'s Trail Notes",
      shotDirection: "",
      lensesNeeded: "Super wide-angle (17 mm equivalent) Photographer\'s Trail Notes",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/kebler-pass-ferns",
      photos: []
    },
    {
      name: "Haystacks on Country Rd #9",
      nearbyTown: "Ridgway",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "7,828 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "EASY TO MODERATE (Rated 2 on a scale of 1-5). The road can be bumpy and may become difficult or impassible in certain conditions. Photographer\'s Trail Notes",
      bestTimeOfDay: "Several hours before sunset. Photographer\'s Trail Notes",
      bestTimeOfYear: "Fall (when hay bales are out and fall colors are present). Photographer\'s Trail Notes",
      photographyTips: "This is a straightforward shot with different views along the road. Scouting several hours before sunset is recommended to find compositions. The shot is particularly special when hay bales are present in the fields. Photographer\'s Trail Notes",
      shotDirection: "",
      lensesNeeded: "Wide angle lens (24-35mm) for grand vistas; a 50mm lens is also mentioned for capturing detail. Photographer\'s Trail Notes",
      equipmentNeeded: "",
      permits: "County Road CR9 is public property; however, the land on either side is private property (Double RL Ranch). Photographer\'s Trail Notes",
      directions: "The location is just west of Ridgway on County Road #9. This is one of three public access roads (5, 7, and 9) that run through the 16,000-acre Double RL Ranch up to the Uncompahgre Plateau. Photographer\'s Trail Notes",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "The road can be difficult or impassible in certain conditions (likely wet weather). Photographer\'s Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/haystacks-on-cr9-photographer-guide",
      photos: []
    },
    {
      name: "Dream Lake Winter",
      nearbyTown: "Estes Park",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "40.304910817028124",
      lng: "-105.64152865955635",
      elevation: "",
      trailDifficulty: "MODERATE TO CHALLENGING",
      bestTimeOfDay: "Sunrise and sunset",
      bestTimeOfYear: "Winter, specifically October through early spring when the lake is frozen",
      photographyTips: "Sunrise provides light on Hallett Peak behind you, while sunset features the sun setting behind the peak. Ensure ice thickness (at least two feet) before venturing out. Look for frozen ice ripples or bubbles as a foreground",
      shotDirection: "Towards Hallett Peak at sunset",
      lensesNeeded: "Wide angle, standard midrange zoom, and telephoto. A macro lens is also helpful for details of frozen bubbles or ice",
      equipmentNeeded: "Microspikes are recommended once the snow is packed down; headlamps are also recommended for sunrise or sunset hikes",
      permits: "Required (Rocky Mountain National Park)",
      directions: "The hike is located in the heart of Rocky Mountain National Park",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Fresh snowfall can obscure the trail, making it challenging; packed snow requires microspikes",
      sourceUrl: "https://photographerstrailnotes.com/colorado/dream-lake-winter",
      photos: []
    },
    {
      name: "Lost Lakes",
      nearbyTown: "Crested Butte",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "9,635 Ft.",
      trailDifficulty: "Moderate (1.5 on a scale of 1-5)",
      bestTimeOfDay: "Morning/Sunrise",
      bestTimeOfYear: "",
      photographyTips: "This is mainly a straight forward shot - with different views based on where you stand around the lake. On a perfectly still morning the reflection of the lake provides many great opportunities. It is suggested to scout out different locations around the lake the day before to determine the best shots for sunrise",
      shotDirection: "",
      lensesNeeded: "Wide-angle lens (16-24mm)",
      equipmentNeeded: "",
      permits: "",
      directions: "The location sits just off of the Kebler Pass. The hike to the location is a simple 300 yd. walk from the campground",
      camping: "There is a campground at the location",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/lost-lakes-photographers-guide",
      photos: []
    },
    {
      name: "Golden Aspen on Gothic Road",
      nearbyTown: "Crested Butte, CO",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.9592",
      lng: "-106.9903",
      elevation: "Approximately 9,485 feet at the Gothic townsite. Time and Date",
      trailDifficulty: "Easy (roadside access) to Moderate (for nearby trails like Snodgrass). Denver7 Trails Offroad",
      bestTimeOfDay: "Sunrise and early morning are recommended for the soft, warm light that makes the golden aspens glow. 501 Life Magazine",
      bestTimeOfYear: "Late September, specifically the last two weeks, is peak for fall colors in this region. Denver7 Present Moment Photographs",
      photographyTips: "Use a polarizer to reduce glare on leaves and saturate colors. Look for compositions that contrast the gold aspens against dark evergreens or the rugged faces of Gothic Mountain. Robbie George Photography Present Moment Photographs",
      shotDirection: "Common shots are taken facing North/Northwest toward Gothic Mountain or South toward the town of Mt. Crested Butte. Rexby",
      lensesNeeded: "Wide-angle lenses (14-24mm) for landscapes and telephoto lenses (70-200mm or longer) for mountain compression and wildlife. Trail Ridge Road Guide",
      equipmentNeeded: "A sturdy tripod, polarizing filters to enhance autumn colors, UV filters, and extra batteries due to cold temperatures are recommended. Trail Ridge Road Guide",
      permits: "No permits are required for the public road; however, nearby trails like Snodgrass have seasonal closures for wildlife and grazing. Erika El Photography",
      directions: "From the town of Crested Butte, head north on Gothic Road (CR 317) past the ski resort and continue into the valley toward the Rocky Mountain Biological Lab. Gunnison Crested Butte",
      camping: "Gothic Campground and Mount Crested Butte Campground are nearby; dispersed camping is also available along some sections of the road. Lucy Schultz Photography",
      lodging: "Various options in Crested Butte and Mt. Crested Butte, including the Limelight Hotel and local historic lodges. Erika El Photography",
      restaurants: "Numerous dining options are available in downtown Crested Butte. Erika El Photography",
      cellService: "Cell service is generally available near the town of Mt. Crested Butte but becomes spotty or non-existent as you travel further north into the valley. Durango and Silverton Train (context)",
      weather: "Weather changes rapidly; cool mornings and warm afternoons are typical in September, with a possibility of early snow at higher elevations. Savannah Chandler Photography",
      sourceUrl: "https://photographerstrailnotes.com/colorado/golden-aspen-on-gothic-road",
      photos: []
    },
    {
      name: "North Creek Falls",
      nearbyTown: "Lake City",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "11,664 Ft",
      trailDifficulty: "EASY TO MODERATE (2 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "Peak season (specific months not mentioned)",
      photographyTips: "You can shoot these falls from multiple angles and vantage points. The easiest place to shoot the falls in from the visitors area just off of the road. Caution is paramount when setting up for shots as some vantage points are on a ledge 100ft above the river.",
      shotDirection: "",
      lensesNeeded: "24mm lens",
      equipmentNeeded: "",
      permits: "",
      directions: "Driving on CO 149 about 26 miles east of Lake City, CO.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "In its peak season, this waterfall rages over the cliff with a bridal veil form into the gorge below.",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/north-creek-falls-photographers-guide",
      photos: []
    },
    {
      name: "McClure Pass Summit",
      nearbyTown: "Marble, CO Photographer\'s Trail Notes",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,725 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "EASY (1 on a scale of 1-5) Photographer\'s Trail Notes",
      bestTimeOfDay: "Not specified in the preview content.",
      bestTimeOfYear: "Fall (mentions Aspen colors in the fall) Photographer\'s Trail Notes",
      photographyTips: "The location offers dozens of compositions along a rail across from the parking area. It can be shot as an extreme panorama, a straightforward shot, or with compression. It is recommended to walk up and down the rail to find a composition before setting up a tripod Photographer\'s Trail Notes.",
      shotDirection: "The location provides views of several southeast-facing mountain ranges, with stunning views available on both the east and west sides Photographer\'s Trail Notes.",
      lensesNeeded: "16mm – 70mm (extremely wide to a medium compression) Photographer\'s Trail Notes",
      equipmentNeeded: "Tripod (mentioned in photography tips) Photographer\'s Trail Notes.",
      permits: "Not specified in the preview content.",
      directions: "The location is a 5-10 mile stretch just south of Marble, CO on CO 133. The specific photo spot is a simple 30-yard walk across the road from the pullout at the summit of McClure Pass Photographer\'s Trail Notes.",
      camping: "Not specified in the preview content.",
      lodging: "Not specified in the preview content.",
      restaurants: "Not specified in the preview content.",
      cellService: "Not specified in the preview content.",
      weather: "In the fall, the area features snow-covered mountains as a backdrop to the changing Aspen leaves Photographer\'s Trail Notes.",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/mcclure-pass-photographers-guide",
      photos: []
    },
    {
      name: "House on the Range",
      nearbyTown: "Ridgway",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,645 Ft.",
      trailDifficulty: "MODERATE (3 on a scale of 1-5)",
      bestTimeOfDay: "Mentions scouting the location well before sunset.",
      bestTimeOfYear: "",
      photographyTips: "This is mainly a straight forward shot, but there are different views based on where you stand along the road. Scouting the location well before sunset is suggested to find your preferred view.",
      shotDirection: "",
      lensesNeeded: "35-50mm lens suggested for compression; 75mm lens was used for a 3 horizontal pano stitch.",
      equipmentNeeded: "",
      permits: "The dirt road (County Road CR9) is public property, but the land on either side is private property (Double RL Ranch).",
      directions: "Located just west of Ridgway on County Road 9 (CR9), which runs through the Double RL Ranch. The drive is 4.1 miles on a narrow dirt road with bumps and holes. There is a particularly narrow uphill blind S curve exactly 2 miles from CO HW62. Upon arrival, the shot is an easy 50ft walk off the road.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "If the road is wet or muddy, do not attempt to drive as you are almost guaranteed to get stuck (it is a 12 mile walk back to Ridgway).",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/house-on-the-range-photographers-guide",
      photos: []
    },
    {
      name: "Aspens on Last Dollar Road",
      nearbyTown: "Telluride, Ridgway (Photographer\'s Trail Notes)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "9,640 Ft. (Photographer\'s Trail Notes)",
      trailDifficulty: "MODERATE (Rated 3 out of 5) (Photographer\'s Trail Notes)",
      bestTimeOfDay: "",
      bestTimeOfYear: "Peak fall season (Photographer\'s Trail Notes)",
      photographyTips: "This location features an Aspen grove on a downhill slope, which allows photographers to fill the frame with leaves while avoiding tree trunks and the ground. Timing is essential as the peak color and saturation vary each year (Photographer\'s Trail Notes).",
      shotDirection: "",
      lensesNeeded: "75mm was used for the featured shot; recommended range is 50-200mm (Photographer\'s Trail Notes).",
      equipmentNeeded: "",
      permits: "",
      directions: "The location is accessed via Last Dollar Road (T60). The last 3 miles of the road are very rocky, narrow, and steep, especially the section going toward Telluride which requires a 4-wheel drive vehicle (Photographer\'s Trail Notes).",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "The road is not maintained in winter and remains closed from January through May. It becomes impassable when muddy (Photographer\'s Trail Notes).",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/last-dollar-road-photographers-guide",
      photos: []
    },
    {
      name: "On Golden Pond",
      nearbyTown: "Telluride, Ridgway, Ophir Source",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "9,586 Ft. Source",
      trailDifficulty: "EASY (1 on a scale of 1-5). It is an easy 20-yard walk from the road. Source",
      bestTimeOfDay: "Early in the morning or on an overcast day with no wind. Avoid harsh late morning or mid-day sun. Source",
      bestTimeOfYear: "Fall colors season (early October). Source",
      photographyTips: "The location is great for reflections. The scene is artistically flexible for composition. Consider using longer lenses for compression of aspens and water reflections. Source",
      shotDirection: "East at 90°. Source",
      lensesNeeded: "50mm lens or a 105mm equivalent for a three-shot vertical panorama to compress the scene. Source",
      equipmentNeeded: "Sturdy tripod, polarizing filter, and a good eye. Source",
      permits: "No permits required. Note: Part of Cashman Lake inside the chain-linked fence is private property; do not cross the fence. Source",
      directions: "From Telluride: Drive west on CO-145 N for 3 miles to the traffic circle. Take the 2nd exit onto CO-145 S and travel 4.3 miles to a small parking area next to the pond. From Ridgway: Drive west on CO-62 W for 23 miles to CO-145. Turn left onto CO-145 and drive 12.7 miles to the traffic circle. Take the 1st exit and travel 4.3 miles to the pond. From the parking area, walk back to the road and then walk 200 yards to the overview of Cashman Lake. Source",
      camping: "Sunshine Campground located off of CO-145 near Ophir. Source",
      lodging: "New Sheridan Hotel and Hotel Columbia in Telluride. Source",
      restaurants: "Smugglers Brewpub and There in Telluride. Source",
      cellService: "Spotty (tested with Verizon). Source",
      weather: "Mild in summer, cold in spring and fall (lows in the 20s). Source",
      sourceUrl: "https://photographerstrailnotes.com/colorado/on-golden-pond",
      photos: []
    },
    {
      name: "Aspens On Ohio Pass",
      nearbyTown: "Crested Butte and Gunnison, Colorado. Gunnison Crested Butte",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.8347153",
      lng: "-107.0917150",
      elevation: "Approximately 10,065 feet at the summit of the pass. Wikipedia",
      trailDifficulty: "Easy; many of the best views are accessible directly from the roadside or via short, relatively flat walks. Travel Crested Butte",
      bestTimeOfDay: "Sunrise and sunset are ideal, with the evening light particularly noted for illuminating the groves and nearby rock formations. Gunnison Crested Butte",
      bestTimeOfYear: "Peak fall colors typically occur from the last week of September through the first week of October. Present Moment Photographs",
      photographyTips: "Use a polarizer to reduce reflections on leaves and increase color saturation. For a more creative look, try vertical panning (ICM) with a slow shutter speed to capture the vertical lines of the aspen trunks. Photo Cascadia",
      shotDirection: "The most famous view is at the hairpin corner near the top of the pass, facing toward the \"Castles\" rock formation and the West Elk Wilderness. Gunnison Crested Butte",
      lensesNeeded: "Medium-wide angle lenses (e.g., 17-35mm) are useful for broad vistas, while telephoto zooms (e.g., 70-200mm or 300mm) are excellent for compressing tree trunks and isolating details. Nature Photographers Network",
      equipmentNeeded: "A tripod and a circular polarizer are highly recommended for landscape photography in this area. Photo Cascadia",
      permits: "No permits are required for day-use photography or hiking in this specific area. Gunnison Crested Butte",
      directions: "From Crested Butte, travel west on Whiterock Ave (which becomes Kebler Pass Road/CR 12) for about 6.5 miles. Turn left onto Ohio Pass Road (CR 730) and continue for approximately 4 miles to reach the summit and surrounding groves. Travel Crested Butte",
      camping: "Dispersed camping is available along Ohio Pass Road (CR 730) and near Lost Lakes. Present Moment Photographs",
      lodging: "Various options are available in the nearby towns of Crested Butte and Gunnison, including the Nordic Inn. Gunnison Crested Butte",
      restaurants: "Numerous dining options can be found on Elk Avenue in downtown Crested Butte. Gunnison Crested Butte",
      cellService: "Cell service is generally unavailable or extremely poor in the backcountry areas near the pass. Travel Crested Butte",
      weather: "The area is at a high elevation (over 10,000 feet), so weather can change rapidly. Expect cool to cold temperatures during the fall color season. Colorado Hikes and Hops",
      sourceUrl: "https://photographerstrailnotes.com/colorado/aspens-on-ohio-pass",
      photos: []
    },
    {
      name: "Great Sand Dunes",
      nearbyTown: "",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "8,200 to 13,604 ft (depending on location on the dunes).",
      trailDifficulty: "MODERATE to HARD (2-4 on a scale of 1-5). Flat areas near the creek are rated 2, while climbing the dunes is rated 4 due to steep sand, sun exposure, and high elevation.",
      bestTimeOfDay: "Early in the morning or late in the afternoon/evening.",
      bestTimeOfYear: "Late spring and early summer (for Medano Creek flow), though snow-capped peaks and wildflowers provide opportunities at other times.",
      photographyTips: "Focus on contrast, depth, curves, lines, dimension, shapes, and shadows. Look for abstracts in the dunes. Avoid flat light. Note that dunes are constantly shifting due to wind, changing compositions over time.",
      shotDirection: "",
      lensesNeeded: "Ultra-wide-angle (16mm – 35mm) to mid telephoto (70mm – 200mm).",
      equipmentNeeded: "",
      permits: "",
      directions: "The park is accessible via well-maintained, paved roads. The dunes can be reached from several clearly designated parking areas north of the Visitor’s Center, with the primary one being \'Dunes Parking\'. From the parking lot, it is a 30-50 meter walk to the sandy area surrounding the main dune field.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Sand surface temperatures can reach up to 150 °F in summer. High elevation leads to severe sun exposure and potential dehydration. There is no shelter or trees on the dunes.",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/great-sand-dunes-photographers-guide",
      photos: []
    },
    {
      name: "Winding Road To Gothic",
      nearbyTown: "Crested Butte",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.930917",
      lng: "-106.967639",
      elevation: "9,583 ft. Photographers Trail Notes",
      trailDifficulty: "Easy (1 on a scale of 1-5). Photographers Trail Notes",
      bestTimeOfDay: "Early morning (before the sun crests the mountains to the east), late afternoon (when the mountains block the sun to the west), or on an overcast day. Photographers Trail Notes",
      bestTimeOfYear: "Any time of year, but best during the fall when the aspens and underbrush turn colorful (e.g., mid-September). Photographers Trail Notes",
      photographyTips: "The shot is straightforward. Look for \"S\" curves in the road and find a composition you like. Photographers Trail Notes",
      shotDirection: "317° Photographers Trail Notes",
      lensesNeeded: "24-105mm (example shot taken at 75mm). Photographers Trail Notes",
      equipmentNeeded: "No special equipment needed other than your imagination. Photographers Trail Notes",
      permits: "No permits are required on Gothic Pass. Photographers Trail Notes",
      directions: "From Crested Butte, drive on (CO 317) Gothic Rd for 4 miles until the end of the paved road. Continue on the dirt road for 1.5 miles through an aspen grove. Photographers Trail Notes",
      camping: "Gothic Campground is about 3 miles away. Photographers Trail Notes",
      lodging: "Plenty of lodging in Crested Butte (about 5 miles away), including Lodge at Mountaineer Square and Grand Lodge Crested Butte. Photographers Trail Notes",
      restaurants: "McGills or Butte Bagels for breakfast; Marchitelli\'s (Italian) or Elk Ave Prime (Steak) for dinner. Photographers Trail Notes",
      cellService: "Spotty (tested with Verizon). Photographers Trail Notes",
      weather: "Mild in summer, cold in spring and fall (lows in the 20s). High elevation (nearly 10,000 ft) makes it colder than surrounding areas. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/colorado/winding-road-to-gothic",
      photos: []
    },
    {
      name: "East Beckwith Mountain",
      nearbyTown: "Crested Butte (Photographers Trail Notes, Facebook)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "Approximately 8,800 to 9,900 feet along the trails and pass area (Hiking & Walking). The peak itself is 12,432 feet (Dave Showalter).",
      trailDifficulty: "Easy to Moderate, depending on how far you venture into the groves or toward the pass (Hiking & Walking, Photographers Trail Notes Preview).",
      bestTimeOfDay: "Late afternoon and sunset (Jim Doty Blog), although sunrise can also provide good light (Dave Showalter).",
      bestTimeOfYear: "Fall, typically late September to early October when the aspen leaves change color (Jim Doty Blog, Facebook).",
      photographyTips: "Look for interesting compositions by walking around the groves, and use the mountain peaks as a backdrop for the golden aspens. Backlighting can make the leaves glow against darker evergreen backgrounds (Jim Doty Blog, Photographers Trail Notes Preview).",
      shotDirection: "Generally facing South or Southwest toward the Beckwith Mountains from the Kebler Pass road area (Facebook, Dave Showalter).",
      lensesNeeded: "Wide-angle lenses (16-24mm) for expansive forest shots and telephoto lenses (70-200mm) for mountain compression (Jim Doty Blog, Photographers Trail Notes Preview).",
      equipmentNeeded: "A sturdy tripod for sharp landscapes and a circular polarizer to enhance the colors and reduce glare on the leaves (Jim Doty Blog).",
      permits: "Generally not required for personal photography in the Gunnison National Forest, though commercial use may require a permit (US Forest Service).",
      directions: "The location is reached via Kebler Pass Road (Gunnison County Road 12) west of Crested Butte, Colorado (Facebook, Hiking & Walking).",
      camping: "Lost Lake Campground and Horse Ranch Park are nearby options along Kebler Pass (Hiking & Walking, Dave Showalter).",
      lodging: "Various options are available in the nearby town of Crested Butte (Hiking & Walking).",
      restaurants: "Numerous dining options are located in Crested Butte (Hiking & Walking).",
      cellService: "Typically unavailable or very limited in the remote Kebler Pass area (Photographers Trail Notes Guidebook Preview).",
      weather: "Typical high-altitude mountain climate; be prepared for cold temperatures, wind, and the possibility of early season snow in the fall (Jim Doty Blog).",
      sourceUrl: "https://photographerstrailnotes.com/colorado/east-beckwith-aspens",
      photos: []
    },
    {
      name: "Capital Peak",
      nearbyTown: "Snowmass Village, CO",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "39.451611",
      lng: "-106.837956",
      elevation: "9,253 Ft. Elevation",
      trailDifficulty: "MODERATE TO HARD (3.5 on a scale of 1-5). Photographers Trail Notes",
      bestTimeOfDay: "Sunset (implied by \"glows red at dusk\" and \"sun not to be blocked by clouds at sunset\")",
      bestTimeOfYear: "Fall (implied by \"during the fall months the Capitol peak glows red at dusk\" and \"Aspens on the left side of the mountain\")",
      photographyTips: "This is a beautiful vista but you have to get real lucky to capture an epic image here. You need: the right time of year, the right light, snow on the mountains, clouds, and for the sun not to be blocked by clouds at sunset. If you are here in the fall, you may need to visit several times to make sure the Aspens on the left side of the mountain are just right. Photographers Trail Notes",
      shotDirection: "At the peak (implied by overlook/trailhead) Photographers Trail Notes",
      lensesNeeded: "24mm to 135mm. Photographers Trail Notes",
      equipmentNeeded: "High clearance vehicle (strongly suggested for the last mile). Photographers Trail Notes",
      permits: "",
      directions: "When you finally make it to the top of a pretty serious dirt road (very narrow at the end with lots and lots of bumps) and arrive at the Capital Peak overlook/trailhead...\" I would strongly suggest a high clearance vehicle because the last mile or so drives through a very narrow dirt road with lots of very high berms. Photographers Trail Notes",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Glows red at dusk; snow on mountains mentioned as part of an epic image. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/colorado-preview/capital-peak-photographers-guide",
      photos: []
    },
    {
      name: "Horse Ranch Summit",
      nearbyTown: "Crested Butte, CO TrailMeister",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "38.8631",
      lng: "-107.1656",
      elevation: "Approximately 8,868 feet at the meadow, reaching up to 9,948 feet on the loop Travel Crested Butte.",
      trailDifficulty: "Moderate Travel Crested Butte",
      bestTimeOfDay: "Sunrise and sunset are typically recommended for the surrounding peaks like the Beckwith Mountains and Ruby Peak ADVENTR.co.",
      bestTimeOfYear: "Autumn/Fall is the primary season for this location due to the extensive aspen groves on Kebler Pass Photographers Trail Notes.",
      photographyTips: "The area offers excellent views of East Beckwith Mountain, Ruby Peak, and thick aspen groves Travel Crested Butte.",
      shotDirection: "None visible.",
      lensesNeeded: "None visible.",
      equipmentNeeded: "None visible.",
      permits: "None visible.",
      directions: "From Crested Butte, travel west on County Road 12 (Kebler Pass Road) for approximately 11.7 miles and turn right at the sign for Horse Ranch Park Travel Crested Butte.",
      camping: "Dispersed camping is available at Horse Ranch Park, a large meadow with a 7-day limit and vaulted toilets TrailMeister.",
      lodging: "None visible.",
      restaurants: "None visible.",
      cellService: "None visible.",
      weather: "The location is high-elevation and subject to sudden mountain weather changes; peak color for aspens typically occurs in late September or early October BIKEPACKING.com (general Colorado high-country reference).",
      sourceUrl: "https://photographerstrailnotes.com/colorado/horse-ranch-summit",
      photos: []
    },
    {
      name: "Riding With Gordon",
      nearbyTown: "Ophir, CO; Telluride, CO; Ridgway, CO (Photographer\'s Trail Notes)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "37.850722",
      lng: "-107.779667",
      elevation: "11,790 Ft. (Photographer\'s Trail Notes)",
      trailDifficulty: "3 out of 5 (Moderate to Challenging) (Photographer\'s Trail Notes)",
      bestTimeOfDay: "Late afternoon (around 6:27 p.m.) (Photographer\'s Trail Notes)",
      bestTimeOfYear: "Late September to early October (Photographer\'s Trail Notes)",
      photographyTips: "The shot is made possible by late afternoon clouds. The direction of the shot is west around 270° (Photographer\'s Trail Notes)",
      shotDirection: "West (around 270°) (Photographer\'s Trail Notes)",
      lensesNeeded: "60mm (used for the featured shot) (Photographer\'s Trail Notes)",
      equipmentNeeded: "4x4 vehicle required for access (Photographer\'s Trail Notes)",
      permits: "No permits required (Photographer\'s Trail Notes)",
      directions: "From Ridgway, drive south on US HWY 550 (Million Dollar Highway) for 28 miles to a turnoff. The location is on the road facing west. Access via Ophir Pass requires a 4x4 vehicle and involves a single-lane rocky road (Photographer\'s Trail Notes)",
      camping: "Not specified (Photographer\'s Trail Notes)",
      lodging: "Not specified (Photographer\'s Trail Notes)",
      restaurants: "Telluride (closest town): La Cocina de Luz, Smugglers Brewpub (Photographer\'s Trail Notes)",
      cellService: "No cell service for most of the drive up Ophir Pass (tested with Verizon) (Photographer\'s Trail Notes)",
      weather: "High elevation (over 11,500 ft) can be significantly colder than nearby lower locations (Photographer\'s Trail Notes)",
      sourceUrl: "https://photographerstrailnotes.com/colorado/ridn-with-gordon",
      photos: []
    },
    {
      name: "Sunset Over Anvil Mountain",
      nearbyTown: "Ophir, Silverton (Photographer\'s Trail Notes)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "11,780 Ft. (Photographer\'s Trail Notes)",
      trailDifficulty: "3 out of 5 (Challenging) (Photographer\'s Trail Notes)",
      bestTimeOfDay: "Late afternoon / Sunset (Photographer\'s Trail Notes)",
      bestTimeOfYear: "Fall / Autumn (Photographer\'s Trail Notes)",
      photographyTips: "Look for the red or pink glow on Anvil Mountain late in the afternoon. Spend time on both the east and west sides of the summit. The shot is taken from the road at the summit, facing toward Anvil Mountain (Photographer\'s Trail Notes)",
      shotDirection: "Facing toward Anvil Mountain (Photographer\'s Trail Notes)",
      lensesNeeded: "The featured shot was taken at 60mm (Photographer\'s Trail Notes)",
      equipmentNeeded: "4x4 vehicle is required to reach the location (Photographer\'s Trail Notes)",
      permits: "Typically required for professional photography/weddings on public lands; check with local ranger district for specific photography permits (Authentic Collective)",
      directions: "The location is at the summit of Ophir Pass. It can be reached by driving east from Ophir or west from US Highway 550 (Million Dollar Highway). The drive from US 550 is easier but still requires a 4x4 vehicle as it is a single-lane dirt/rocky road with steep drop-offs (Photographer\'s Trail Notes)",
      camping: "South Mineral Campground near Silverton is the nearest Forest Service campground (Climb 13ers)",
      lodging: "The Peaks Resort and Spa in Telluride; Red Mountain Alpine Lodge near the pass (Authentic Collective; Adventure Instead)",
      restaurants: "Dining options available in the nearby towns of Silverton and Telluride.",
      cellService: "Not explicitly mentioned as available; membership required for full details (Photographer\'s Trail Notes)",
      weather: "Ophir Pass is seasonal and weather-dependent, typically accessible June through October (Adventure Instead)",
      sourceUrl: "https://photographerstrailnotes.com/colorado/sunset-over-anvil-mountain",
      photos: []
    },
    {
      name: "Drunken Aspens",
      nearbyTown: "Telluride and Ridgway (Photographers Trail Notes).",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "9,590 Ft. (Photographers Trail Notes).",
      trailDifficulty: "Moderate (2.5 out of 5); easy walk from the road but the drive can be challenging (Photographers Trail Notes).",
      bestTimeOfDay: "Late afternoon (sunset) for side lighting or midday for filtered light through the leaves (Facebook, Photographers Trail Notes).",
      bestTimeOfYear: "Fall (late September to early October) when the leaves turn golden (Photographers Trail Notes, Tripadvisor).",
      photographyTips: "Focus on the unique, \'drunken\' angles of the white trunks against the golden leaves. Use intentional camera movement (ICM) or multiple exposures for abstract effects. Midday light can work when the sun is filtered by the canopy (Facebook, Photographers Trail Notes).",
      shotDirection: "Faces the grove; specific cardinal direction varies by composition but often toward the mountains (Sneffels Range/Wilson Peak) (Photographers Trail Notes).",
      lensesNeeded: "Variety of lenses including 50-200mm for compression or wider for the grove (Photographers Trail Notes).",
      equipmentNeeded: "High-clearance 4x4 vehicle is strongly recommended for the middle and Telluride sections of the road; tripod for long exposures or intentional camera movement (Photographers Trail Notes, Tripadvisor).",
      permits: "None specified for general photography; standard forest service rules apply for camping (Photographers Trail Notes).",
      directions: "From Ridgway, take Highway 62 west to Last Dollar Road (CR 58P/T60). Follow the road as it climbs; the \'Drunken Aspens\' are located in a grove along this road before it becomes very steep/technical near the Telluride side (Tripadvisor, Photographers Trail Notes).",
      camping: "Dispersed camping is available along Last Dollar Road (The Dyrt).",
      lodging: "Available in the nearby towns of Telluride and Ridgway (Tripadvisor).",
      restaurants: "Dining options are available in Telluride and Ridgway (Tripadvisor).",
      cellService: "Likely limited or unavailable due to the remote mountain location (Photographers Trail Notes).",
      weather: "The road is closed from January through May; it is impassable when muddy. Be prepared for rapid mountain weather changes in fall (Photographers Trail Notes).",
      sourceUrl: "https://photographerstrailnotes.com/colorado/drunken-aspens",
      photos: []
    },
    {
      name: "Mt Crested Butte From East River",
      nearbyTown: "Crested Butte, Mt. Crested Butte, Gothic Colorado 13ers.",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "Approximately 9,000 - 9,400 feet in the valley Gunnison County; town of Mt. Crested Butte is at 9,375 feet.",
      trailDifficulty: "Easy (accessible via roadside pull-offs or short, level walks along the East River Trail) Gaia GPS.",
      bestTimeOfDay: "Sunrise Present Moment Photographs for morning light glowing off the mountain.",
      bestTimeOfYear: "Late September to early October for fall colors Present Moment Photographs; July and August for wildflowers Julien Kibler.",
      photographyTips: "Look for \"alpenglow\" at sunrise when the peak is hit by morning light Julien Kibler. Use the meandering East River in the foreground to create leading lines toward the peak Facebook.",
      shotDirection: "Facing East/Southeast toward Mt. Crested Butte from the valley floor.",
      lensesNeeded: "Wide angle lens for broad vistas Present Moment Photographs.",
      equipmentNeeded: "Standard landscape photography gear including a tripod and polarizing filter. Warm clothes are recommended as temperatures can be in the 20s even in late August Colorado Hikes and Hops.",
      permits: "Generally not required for personal or small group portrait photography on US Forest Service lands (groups < 6) Larsen Photo Co.. Commercial shoots may require a permit from the GMUG National Forest Gunnison Crested Butte.",
      directions: "From Crested Butte, drive north on Gothic Road (County Road 317). The road crosses the East River approximately 2.9 miles from the end of the pavement Colorado 13ers. Pull-offs along this stretch offer views of the river and mountain Present Moment Photographs.",
      camping: "Gothic Campground (4 sites, past Gothic), Oh Be Joyful Campground (Slate River Drainage), and various designated sites along Gothic Road (CR 317) past Gothic Travel Crested Butte.",
      lodging: "Elevation Hotel and Spa, Nordic Inn, and Grand Lodge in Mt. Crested Butte Colorado Hikes and Hops; Lori J. Welch.",
      restaurants: "Camp 4 Coffee, Soupcon, Two Twelve, and Butte 66 (for après ski/views) in Crested Butte and Mt. Crested Butte Colorado Hikes and Hops; Crested Butte Mountain Resort.",
      cellService: "None available in the immediate area or valley Colorado Hikes and Hops; Hipcamp.",
      weather: "High altitude climate with cool mornings even in summer; potential for afternoon thunderstorms in July and August Colorado Hikes and Hops.",
      sourceUrl: "https://photographerstrailnotes.com/colorado/mt-crested-butte-from-east-river",
      photos: []
    },
    {
      name: "Last Light on Kebler Pass",
      nearbyTown: "Crested Butte, Paonia (Photographers Trail Notes, Trails Offroad)",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "",
      lng: "",
      elevation: "10,007 ft (Wikipedia, TopoZone)",
      trailDifficulty: "Easy to Moderate; rating 2 out of 5",
      bestTimeOfDay: "Sunset / Golden Hour (Photographers Trail Notes, Present Moment Photographs)",
      bestTimeOfYear: "Last week of September to early October (Photographers Trail Notes, RMNPhotographer)",
      photographyTips: "Explore off the main road for unique compositions; look for interesting white-trunk aspen groves with ferns; use the golden hour light to illuminate the trees (Photographers Trail Notes, Present Moment Photographs)",
      shotDirection: "Western approach facing east/southeast for sunset glow on the mountains (Facebook, Present Moment Photographs)",
      lensesNeeded: "Wide-angle to short telephoto; 17mm-70mm range (Photographers Trail Notes, Present Moment Photographs)",
      equipmentNeeded: "Standard outdoor/photography gear; high-clearance vehicle recommended for side roads (Tripadvisor, Present Moment Photographs)",
      permits: "None specified for general viewing; standard USFS regulations for camping (Travel Crested Butte)",
      directions: "From Crested Butte, take County Road 12 (Kebler Pass Road) west for approximately 30 miles toward Highway 133 (Tripadvisor, Trails Offroad)",
      camping: "Lost Lake Campground, Lake Irwin Campground, and dispersed camping along Kebler Pass Road (Travel Crested Butte)",
      lodging: "Elk Mountain Lodge, Old Town Inn, Eleven Scarp Ridge Lodge, and Forest Queen Hotel in Crested Butte (Tripadvisor)",
      restaurants: "Coal Creek Grill, Public House, and various eateries in Crested Butte (Tripadvisor)",
      cellService: "None / Off the grid (Kebler Corner, Tripadvisor)",
      weather: "High-altitude mountain climate; cool to cold, especially at night; potential for snow in early fall (Weather.gov, OpenSnow)",
      sourceUrl: "https://photographerstrailnotes.com/colorado/last-light-on-kebler-pass",
      photos: []
    },
    {
      name: "Dusk Near Brown Lakes",
      nearbyTown: "Creede (approx. 20-26 miles south) and Lake City, Colorado. Photographer\'s Trail Notes Preview",
      state: "Colorado",
      region: "Rocky Mountains",
      lat: "37.8233324",
      lng: "-107.1922748",
      elevation: "Approximately 9,800 feet (2,987 meters). TopoZone",
      trailDifficulty: "Easy. The overlook is accessible directly from the road or a very short walk from the parking area. Tripadvisor",
      bestTimeOfDay: "Late afternoon and dusk (Blue Hour) for the best lighting as the sun sets behind the mountains. Arrive about an hour before sunset to scout and capture the changing light. Photographer\'s Trail Notes",
      bestTimeOfYear: "Autumn (late September to early October) is ideal for capturing the yellow and gold aspen trees. Summer (late June to August) also offers vibrant greens and wildflowers. Blog.JimDoty.com",
      photographyTips: "Focus on the reflection of the mountains and aspens in the lake. Use a small aperture (f/11 to f/16) for maximum depth of field. Use the old fence and aspens as foreground elements to provide a sense of the \'open range\'. Backlit or sidelit scenarios at dusk produce the most dramatic colors. Photographer\'s Trail Notes Meta Description",
      shotDirection: "Facing Southwest towards the mountains and Brown Lakes from the scenic overlook or the lakeshore. Facebook",
      lensesNeeded: "Wide-angle lens (e.g., 16-35mm or 14-24mm) for vast landscapes and reflections, and a mid-range zoom (e.g., 24-105mm or 70-200mm) for compressing mountain scenes or capturing details. Photographer\'s Trail Notes Preview",
      equipmentNeeded: "Tripod for long exposures at dusk, remote shutter release, warm layers/jacket (temperatures drop quickly at high elevation), and muck boots if shooting near the water\'s edge. Nature TTL",
      permits: "A valid hunting or fishing license or a Colorado State Wildlife Area (SWA) pass is required to access the Brown Lakes State Wildlife Area. Colorado Parks and Wildlife",
      directions: "From Creede, drive approximately 20-26 miles north/west on CO Highway 149 (Silver Thread Scenic Byway) towards Lake City. Brown Lakes are located about 2 miles off CO 149 via a dirt access road near North Clear Creek Falls. Dave Weller\'s Fly Fishing Blog",
      camping: "North Clear Creek Campground is located nearby on CO 149. Dave Weller\'s Fly Fishing Blog",
      lodging: "Various options available in the nearby town of Creede, including the Creede Hotel & Restaurant and local Airbnbs. Tripadvisor",
      restaurants: "Local dining in Creede includes Kip’s Grill, Tommyknocker Tavern, and the Creede Hotel & Restaurant. Tripadvisor",
      cellService: "Poor to no cell service in the immediate area; it is recommended to have offline maps or physical directions. Tripadvisor",
      weather: "Typical high-alpine climate: cold mornings and evenings, even in summer. High winds are common near the lakes. Be prepared for sudden changes in weather. Dave Weller\'s Fly Fishing Blog",
      sourceUrl: "https://photographerstrailnotes.com/colorado/dusk-near-brown-lake",
      photos: []
    },
    {
      name: "Majestic Morning",
      nearbyTown: "Alabama Hills",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,775 Ft.",
      trailDifficulty: "MODERATE (2 on a scale of 1-5). A fairly easy 250 yd walk up a modest slope (Photographer\'s Trail Notes).",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "Hundreds of locations around the Alabama Hills to photograph sunrise with Mt. Whitney in the background. Hike up the slope of one of the hills for a more level composition of Mt. Whitney (approximately 120 yards from the \"Eye of Alabama Arch\") (Photographer\'s Trail Notes).",
      shotDirection: "Facing Mt. Whitney and the eastern Sierra’s (Photographer\'s Trail Notes).",
      lensesNeeded: "Standard to short telephoto lens (60mm equivalent) (Photographer\'s Trail Notes).",
      equipmentNeeded: "Standard to short telephoto lens (60mm equivalent) (Photographer\'s Trail Notes).",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/majestic-morning-photographers-guide",
      photos: []
    },
    {
      name: "Bristlecone Pines",
      nearbyTown: "Big Pine",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "10,250 Ft.",
      trailDifficulty: "MODERATE (2.5 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "Photographing the Bristlecone Pines involves pointing upward at the magnificent trees, often focusing on isolating a single tree against the sky. To achieve the best shape, it is recommended to be very close to the tree and shoot upward. The tree appears most wide and balanced when photographed straight on; moving to the side can make the tree\'s shape appear narrow and less compelling. The trees are located on a sloping hill that rises for several hundred feet, adding complexity to the composition.",
      shotDirection: "",
      lensesNeeded: "Wide angle lenses (11-24mm range)",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "The area is described as an inhospitable environment where trees endure brutal temperatures.",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/bristlecone-pines-photographers-guide",
      photos: []
    },
    {
      name: "Badwater Basin",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "-282 Ft. Elevation",
      trailDifficulty: "EASY TO MODERATE (1-2 on a scale of 1-5). The hike to this location ranges between 1/2 and 1 mile from the parking area (depending on the route you take) with little to no elevation gain.",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "You would think shooting a flat hexagonal-shaped salt pattern would be so simple a caveman could do it. Well, it is not as easy as it looks. First, you want to decide which direction you will shoot - North or South. The sky, time of year, time of day, crowds, and weather may impact this decision. Next, you need to find a suitable series...",
      shotDirection: "",
      lensesNeeded: "Depending on your composition, you will want to bring a wide or ultra-wide-angle lens. The image above was taken with a 17mm equivalent lens.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Death Valley is one of the hottest places on earth. The location is 282 ft below sea level, making it the lowest point in North America, and is entirely void of any foliage, structure, or water (most of the time).",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/badwater-photographers-guide",
      photos: []
    },
    {
      name: "Desert Waves",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "270 Ft.",
      trailDifficulty: "Moderate (rated 2 on a scale of 1 to 5).",
      bestTimeOfDay: "Sunrise and sunset, with the best light occurring 20 to 30 minutes after sunset (blue hour).",
      bestTimeOfYear: "Winter months.",
      photographyTips: "Photograph the dunes from an elevated vantage point (about 300 feet above) to capture sections with fewer footprints. The best compositions are generally to the right (east) where the dunes appear more wave-like.",
      shotDirection: "East (to the right).",
      lensesNeeded: "A very long lens is recommended; the guide mentions using a 100-500mm zoom lens with a 1.4x extender (effective 700mm).",
      equipmentNeeded: "A standard SUV for the gravel road and a very long lens with an extender.",
      permits: "",
      directions: "Located along Grotto Canyon road, a maintained gravel path just north of the Mesquite Dunes parking lot in Death Valley. The road is approximately one mile long.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Dune colors change based on the sky\'s reflective hues.",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/desert-waves-photographers-guide",
      photos: []
    },
    {
      name: "Alabama by Morning",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,582 Ft.",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "Blue hour (with flat light) or when the sun starts to crest the horizon and begins to illuminate the Lone Pine Peak in the distance.",
      bestTimeOfYear: "",
      photographyTips: "Try to position yourself on a rock just north of the dirt road by the location. The rock is about 3 feet tall and may take some shambling. Once on the rock find your composition and wait for the best light.",
      shotDirection: "",
      lensesNeeded: "35 mm - 70 mm.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/alabama-by-morning-photographers-guide",
      photos: []
    },
    {
      name: "Last Light on Ibex Dunes",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "270 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "MODERATE (Rated 3 out of 5). Photographer\'s Trail Notes",
      bestTimeOfDay: "Late afternoon to sunset and the blue hour. Photographer\'s Trail Notes",
      bestTimeOfYear: "",
      photographyTips: "Focus on compression shots, abstracts, and moods created by the curves and shadows of the dunes. The five main dunes run north-south, making them ideal for late afternoon and sunset photography as the light illuminates the ridges. Arrive early to scout positions, and stay for the blue hour after sunset for additional shooting opportunities. Photographer\'s Trail Notes",
      shotDirection: "",
      lensesNeeded: "Telephoto lenses ranging from 100mm to 500mm are recommended for compression shots and abstracts. Photographer\'s Trail Notes",
      equipmentNeeded: "",
      permits: "",
      directions: "The location is approximately 9 miles off Highway 127. The first 6 miles are on an old gravel road with significant washboards (10-20 mph), followed by 3 miles of easier but still rocky and sandy terrain. From the small, unmarked parking area at the trailhead, it is a moderate 1.5-mile walk to the dunes. Photographer\'s Trail Notes",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/last-light-on-ibex-dunes-photographers-guide",
      photos: []
    },
    {
      name: "Lake Manly",
      nearbyTown: "Death Valley NP",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "-280 Ft. Elevation",
      trailDifficulty: "MODERATE (2 on a scale of 1 to 5)",
      bestTimeOfDay: "Sunrise, sunset, or night for the Milky Way",
      bestTimeOfYear: "Only when Death Valley receives substantial rain near Badwater Basin",
      photographyTips: "Wait for people to position themselves in openings for scale; increase ISO to prevent camera shake during sunset capture; and be prepared for mirror-like reflections (Photographer\'s Trail Notes).",
      shotDirection: "",
      lensesNeeded: "Wide-angle or ultra-wide-angle lens; the example image used a 24mm lens (Photographer\'s Trail Notes).",
      equipmentNeeded: "",
      permits: "",
      directions: "The hike to this location is between 1/2 and 1 mile from the parking area, depending on the route (Photographer\'s Trail Notes).",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Substantial rain is required for the lake to form; little to no elevation gain, but walking in water might create challenges (Photographer\'s Trail Notes).",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/lake-manly-photographers-guide",
      photos: []
    },
    {
      name: "Mesquite Dunes",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "43 Ft.",
      trailDifficulty: "MODERATE (2-3 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "When shooting sand dunes, look for abstracts or moods created by curves and shadows. Finding curved formations and intriguing ripples in the sand can help guide the eye. To maintain sharpness throughout the image, consider focus stacking 8-10 images. Experimenting with different positions, angles, focal lengths, and tripod heights can help eliminate distracting background elements like mountains.",
      shotDirection: "",
      lensesNeeded: "Wide-angle to telephoto lenses are recommended. Medium to long telephotos are useful for capturing abstracts or compressions, though some shots were taken with a 24mm equivalent lens. It is advised to avoid changing lenses in blowing sand.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "The dunes are located in Death Valley, which is described as the \"hottest, driest, and lowest national park.\" Blowing sand is a concern for photography equipment.",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/mesquite-dunes-photographers-guide",
      photos: []
    },
    {
      name: "Olmsted Point",
      nearbyTown: "Lee Vining (implied as a nearby access point) Photographers Trail Notes",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,399 Ft. (Note: The summary text also mentions 8418 feet)",
      trailDifficulty: "EASY (1 to 2 on a scale of 1-5). Photographers Trail Notes",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "The “glacial erratics” provide great foreground interest. If you use a wide angle lens you can make these small boulders look very large. Other foreground options include the small “puddles” formed in the granite, or use the linear grooves or pick a grouping of trees. Photographers Trail Notes",
      shotDirection: "Facing Half Dome\'s northeastern face; looking down Tenaya Canyon toward Yosemite Valley. Photographers Trail Notes",
      lensesNeeded: "Both wide angle and telephoto lenses. Photographers Trail Notes",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Windy conditions noted. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/olmsted-point-photographers-guide",
      photos: []
    },
    {
      name: "Winter at Zabriskie Point",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "740 Ft. Elevation",
      trailDifficulty: "MODERATE (3 on a scale of 1-5). The hike involves a steep, slick, and narrow rocky ridge for about 150 yards (Photographer\'s Trail Notes).",
      bestTimeOfDay: "Sunrise",
      bestTimeOfYear: "Winter",
      photographyTips: "The composition is described as straightforward, though the sky, mountain, and valley receive light at different times, potentially requiring a composite image to manage the dynamic range as the sky lights up (Photographer\'s Trail Notes).",
      shotDirection: "Toward the shark fin known as Manly Beacon for the most popular focus, though other opportunities exist off the main trail (Photographer\'s Trail Notes).",
      lensesNeeded: "Wide-angle, standard or short telephoto lens. The summary mentions a 45mm equivalent lens was used for one of the shots (Photographer\'s Trail Notes).",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Winter (the guide notes it is a great place to capture images when it snows) (Photographer\'s Trail Notes).",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/winter-at-zabriskie-point-photographers-guide",
      photos: []
    },
    {
      name: "Point Arena Lighthouse",
      nearbyTown: "Point Arena",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "Sea Level Ft.",
      trailDifficulty: "EASY",
      bestTimeOfDay: "Near sunset",
      bestTimeOfYear: "",
      photographyTips: "Using a telephoto lens lets you capture the lighthouse with the waves crashing along the shoreline as there is a long road leading up to the actual lighthouse. The longer focal length is great for compression. Visiting during sunset allows for some dramatic skies at this location. (Note: Winter shots can capture more waves).",
      shotDirection: "",
      lensesNeeded: "Telephoto lens (70 mm - 200 mm or 100 mm - 400 mm). The featured image was taken at 215 mm.",
      equipmentNeeded: "",
      permits: "",
      directions: "Follow Highway 1 north from the town of Point Arena and turn west onto Lighthouse Road at the sign for Lighthouse Pointe Resort. Follow this road to the end and follow signs for parking. There are multiple locations to pull over from the road capture the lighthouse in the distance.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/point-arena",
      photos: []
    },
    {
      name: "Mono Lake",
      nearbyTown: "Lee Vining",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "",
      trailDifficulty: "EASY",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "There are a multitude of angles to shoot the tufa towers - remember to shoot both high (standing) and low (from a more crouched position) and both horizontally and vertically. If you time your visit right, the moon reflects brightly in the lake. The Sierra Nevada mountains to the west of the lake light up with the rising sun. There are additional Tufa\'s to photograph. The 1st set is found just south of Navy Beach, and another 2nd set of formations is about a mile east of Navy Beach. The 2nd set is much larger but requires a 1-mile hike along a sandy/dirt road. Photographer\'s Trail Notes",
      shotDirection: "",
      lensesNeeded: "24mm-105mm or similar.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/mono-lake-photographers-guide",
      photos: []
    },
    {
      name: "Tunnel View",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,399 Ft.",
      trailDifficulty: "EASY",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "From a photography standpoint, this is a layup. From the viewing area - find your composition, wait for the best light, and push the button.",
      shotDirection: "",
      lensesNeeded: "Lenses ranging from 35 mm to 100 mm. The image above was taken as a 3-shot vertical pano with a 70 mm equivalent lens.",
      equipmentNeeded: "",
      permits: "",
      directions: "The location of this shot is from the viewing area, which is about 50 ft from the main parking lot to Tunnel View. However, to get here on a morning with fresh snow may be problematic.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/tunnel-view",
      photos: []
    },
    {
      name: "Vista Point",
      nearbyTown: "Mammoth Lakes",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "7,900 Ft.",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "late sun",
      bestTimeOfYear: "winter",
      photographyTips: "This shot is as close to a layup as you will get in landscape photography. It is pretty straight forward and was taken directly from the side of the road (pullout).",
      shotDirection: "",
      lensesNeeded: "60mm lens",
      equipmentNeeded: "",
      permits: "",
      directions: "on the road from Bishop to Mammoth Lakes, CA",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/vista-point-photographers-guide",
      photos: []
    },
    {
      name: "Cathedral Peak",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "9,606 Ft.",
      trailDifficulty: "CHALLENGING (3-4 out of 5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "Once you have hiked the trail to Upper Cathedral Lake, you can choose your composition. To get Cathedral Peak in the center of the lake and establish a high shooting position, the hike is described as \"pretty sketchy\" and requires extreme caution. Be prepared to shoot an hour or so before sunset to catch the light, and consider keeping your tripod in place until sunset to capture the sun in the sky for compositing.",
      shotDirection: "",
      lensesNeeded: "Standard or wide-angle lens (16-35mm zoom recommended).",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/cathedral-lake-photographers-guide",
      photos: []
    },
    {
      name: "Keyhole Arch",
      nearbyTown: "Big Sur",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "Sea Level",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "January",
      photographyTips: "Check tide levels; low tide provides rocks and sand in the foreground, while high tide may require getting into the water. Shoot and expose for the foreground and consider replacing a blown-out sky. Bracketing is recommended when shooting straight into the sun through the arch.",
      shotDirection: "",
      lensesNeeded: "Wide-angle 15-20 mm, closeup 85-150 mm.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/keyhole-arch-photographers-guide",
      photos: []
    },
    {
      name: "Eureka Dunes",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "2,900 Ft.",
      trailDifficulty: "HARD (rated 4.5 on a scale of 1-5).",
      bestTimeOfDay: "Both sunset and sunrise offer great opportunities here.",
      bestTimeOfYear: "",
      photographyTips: "Shooting the dunes is about curves, lines, dimension, contrast, shapes, and shadows. You are often looking for an abstract in the middle of the obvious. For the featured shot, the photographer searched for a location the day before and marked it with GPS to return pre-dawn for the sunrise.",
      shotDirection: "",
      lensesNeeded: "Lenses/zoom that range from ultra wide to telephoto.",
      equipmentNeeded: "Plenty of food, water, and shelter.",
      permits: "",
      directions: "Located in a remote section of the northern part of Death Valley; reached by a bone-jarring drive.",
      camping: "Campsites are available at the parking lots.",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Windstorms",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/eureka-dunes-photographers-guide",
      photos: []
    },
    {
      name: "Owens River Sunrise",
      nearbyTown: "Big Pine",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,150 Ft.",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "For the most part, this shot is pretty straight forward. However, it is VERY IMPORTANT to get the angle of the curve correct - or it will loose its effect. Too much or too little of the river will loose the effect of the curve. Just take your time and focus on the S in the river. This shot is all about the light, so make sure you are ready when the sun illuminates the peaks of the Sierras ..",
      shotDirection: "",
      lensesNeeded: "24mm lens",
      equipmentNeeded: "",
      permits: "",
      directions: "The hike to this location is an easy 75 yds from the dirt road just east of Big Pine, CA.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/owen-river-sunrise-photographers-guide",
      photos: []
    },
    {
      name: "Firefall",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,025 Ft.",
      trailDifficulty: "EASY TO MODERATE",
      bestTimeOfDay: "Late Afternoon / Sunset",
      bestTimeOfYear: "Mid to late February",
      photographyTips: "The classic location offers the most focal length diversity, allowing for both expansive shots of El Capitan and tight close-ups of the falls. High winds can create interesting effects by dispersing the waterfall spray, while low clouds below the rim can offer unique compositions. Polarizers are recommended to handle water glare, and neutral density filters can be used for long exposures (Photographer\'s Trail Notes).",
      shotDirection: "",
      lensesNeeded: "Classic viewing location: 100-200mm; Southside viewing location: 150-300mm; Four Mile trail location: 200mm or greater (Photographer\'s Trail Notes).",
      equipmentNeeded: "A sturdy tripod and ball head are essential for long exposures. Recommended accessories include a polarizer to mitigate glare and a neutral density filter for silky water effects. Micro-spikes or sturdy hiking boots may be required for the Four Mile trail location if it is snow-covered (Photographer\'s Trail Notes).",
      permits: "",
      directions: "There are three primary viewing locations: 1) The classic location (closest to the falls), 2) the southside location (between Cathedral Beach picnic area and the Swinging Bridge along the Merced River), and 3) a viewpoint approximately 3/4 of a mile up the Four Mile trail (Photographer\'s Trail Notes).",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "The phenomenon requires significant snowpack atop El Capitan, temperatures warm enough to melt the snow, and clear skies with no clouds or haze to block the setting sun\'s rays (Photographer\'s Trail Notes).",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/firefall-photographers-guide",
      photos: []
    },
    {
      name: "Glacier Point",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "7,214 Ft.",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "There are many locations and compositions to shoot around Glacier Point. It is recommended to arrive several hours early to explore and find a preferred composition and wait for the sunset. Timing and weather are important; clouds can create a magical pink glow at sunset, but too many can block it. Without clouds, the shot can feel empty. In summer, the sun sets to the left; in late fall, it sets behind you. Consider including Vernal & Nevada Falls in the shot. Similar views can be found at Sentinel Dome and Washburn Point.",
      shotDirection: "",
      lensesNeeded: "16 – 70mm",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/glacier-point-photographers-guide",
      photos: []
    },
    {
      name: "Joshua Trees at Lee Flat",
      nearbyTown: "Big Pine (indicated on road sign in preview images)",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "1,024 Ft. Elevation",
      trailDifficulty: "3 on a scale of 1-5 (MODERATE TO CHALLENGING). Easy walk from parking, but road is bumpy/rocky/sandy; 4WD suggested for the last mile.",
      bestTimeOfDay: "Membership Required",
      bestTimeOfYear: "Membership Required",
      photographyTips: "Arrive early to scout locations before sunset or evening. For astrophotography, it is difficult to focus in total darkness. Get down low to the ground and shoot upward with an ultra-wide lens to accentuate trees. Telephoto lenses also work for a compressed look.",
      shotDirection: "Membership Required",
      lensesNeeded: "Ultra wide (11-16mm lens)",
      equipmentNeeded: "Membership Required",
      permits: "Membership Required",
      directions: "Membership Required",
      camping: "Membership Required",
      lodging: "Membership Required",
      restaurants: "Membership Required",
      cellService: "Membership Required",
      weather: "Hottest, driest, and lowest national park; steady drought and record summer heat.",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/lee-flat-joshua-trees-photographers-guide",
      photos: []
    },
    {
      name: "Pigeon Point Lighthouse",
      nearbyTown: "Pescadero",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "Sea Level",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "Pigeon Point offers many perspectives, including shooting from the Pigeon Point Viewpoint Parking Lot (half a mile south on Hwy 1), from within the lighthouse premises, and from locations further north along Hwy 1. Shooting low to the ground near the white fence can provide a strong leading line. Avoid attempting the hike down to the beach as the trail is very steep and slippery.",
      shotDirection: "",
      lensesNeeded: "Lenses ranging from ultra-wide (e.g., 24mm) for close-up shots to zoom lenses up to 200-300mm for distant shots from Hwy 1.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/pigeon-point-lighthouse-photographers-guide",
      photos: []
    },
    {
      name: "Yosemite Falls Moonbow",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,050 Ft.",
      trailDifficulty: "EASY (1 on a scale of 1-5)",
      bestTimeOfDay: "When the moon is full or nearly full (usually 2-3 days before and after), and is high enough in the sky at an angle between 40-42 degrees.",
      bestTimeOfYear: "April, May, and June.",
      photographyTips: "A moonbow is only visible when there is enough moonlight (full moon) and mist from the waterfall. While the human eye may see it as a dull white or gray arc, modern camera sensors can capture the colors. Long exposures (30 seconds or greater) may be necessary with slower lenses but can lead to mist accumulation and loss of sharpness. Moonrise times are critical to ensure the moon is at the correct angle.",
      shotDirection: "",
      lensesNeeded: "Fast (f1.4 or f2.8) wide-angle lens between 16-35mm. A 24mm lens is recommended to capture the entire scene with some night sky.",
      equipmentNeeded: "",
      permits: "",
      directions: "From the parking area, it is an easy 1/2 mile walk to the Lower Yosemite Falls viewing area. The moonbow is most often photographed from the footbridge on the Lower Falls Trail where it crosses Yosemite Creek at the base of Lower Yosemite Falls. Locations in Cooks Meadow and around Sentinel Bridge also offer views.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "Requires specific environmental conditions including mist from the waterfall and clear night skies with a full or near-full moon.",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/yosemite-falls-moonbow-photographers-guide",
      photos: []
    },
    {
      name: "Mobius Arch",
      nearbyTown: "Lone Pine",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "4,677 Ft.",
      trailDifficulty: "MODERATE (2 on a scale of 1-5) Mobius Arch Photographer\'s Guide",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "The unique shape and view through the arch are something that usually takes time to compose. The classic shot through the arch with the Sierras in the background is pretty straightforward, but there are many other angles to explore. Mobius Arch Photographer\'s Guide",
      shotDirection: "",
      lensesNeeded: "Ultra-wide to wide-angle lens (e.g., 11mm). Mobius Arch Photographer\'s Guide",
      equipmentNeeded: "",
      permits: "",
      directions: "The Mobius Arch is an easy 200yd. hike from Movie Road in the Alabama Hills, located a few miles west of Lone Pine, California. Mobius Arch Photographer\'s Guide",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/mobius-arch-photographers-guide",
      photos: []
    },
    {
      name: "Zabriskie Point",
      nearbyTown: "",
      state: "California",
      region: "West Coast",
      lat: "",
      lng: "",
      elevation: "743 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "1 - 2.5 (Easy to Challenging) Photographer\'s Trail Notes",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "The area features maze-like ridges with colors including yellows, chocolate browns, pinks, greens, and blues, with the triangular Manly Beacon as a central point. Shooting from the ridge to the right of the visitors\' viewpoint provides a higher vantage point for unique compositions and abstracts. When shooting at sunrise, photographers should be conscious of the sun\'s timing. Photographer\'s Trail Notes",
      shotDirection: "",
      lensesNeeded: "16-135mm lenses; wide-angle for vistas, and standard or short telephotos for compression abstracts. Photographer\'s Trail Notes",
      equipmentNeeded: "",
      permits: "",
      directions: "The visitors\' viewing area is a simple 150-yard walk from the parking lot. For a different perspective, there is a more difficult hike (rated 2.5) up a narrow and rocky ridge to the right of the viewing area, which is about 1/4 mile long. Photographer\'s Trail Notes",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/california-preview/zabriskie-point-photographers-guide",
      photos: []
    },
    {
      name: "Trillium Lake",
      nearbyTown: "Government Camp, OR (approx. 3 miles / 2 miles to the turnoff) AwayGoWe",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "45.27106",
      lng: "-121.7383",
      elevation: "3,601 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "Easy. Rated as a 1 on a scale of 1-5. The location of the main shot is an easy 100-yard walk from the parking area. The loop trail around the lake is approximately 2 miles with very little elevation gain (approx. 10-80 ft). Photographer\'s Trail Notes, Oregon Hikers",
      bestTimeOfDay: "The best time to shoot is early in the day (sunrise) for the best light and potential for a \'perfectly still cold morning\' which provides a glass-like reflection of Mt. Hood. Photographer\'s Trail Notes, Gracefkim",
      bestTimeOfYear: "Summer into Fall (June-October) is the primary season for access. Early in the day, midweek, in late spring or early fall is recommended to avoid crowds. The lake is also popular for snowshoeing and cross-country skiing in winter, though road access is closed. Oregon Hikers, AwayGoWe",
      photographyTips: "The best location for the classic Mt. Hood reflection shot is along the road/beach area, about 100 yards from the main parking lot. Aim for a \'perfectly still cold morning\' to get a mirror reflection on the water. Other vantage points exist around the 2-mile loop trail. Be mindful of other photographers as this is a popular spot. Challenges include finding the best light and dealing with wind which can disturb the reflection. Photographer\'s Trail Notes, Gracefkim Additional notes: The guide notes that Trillium Lake is a \'stunning, spectacular, and incredible\' location situated at the base of Mt. Hood. It\'s a popular spot for families, kayakers, hikers, and fishermen in the summer. The location is known for its crystal-clear lake and majestic vistas of Mt. Hood. Once crowds clear, it transforms into one of the most beautiful vistas in the Northwest. The guide is written by professional photographer Tim Wier. Photographer\'s Trail Notes",
      shotDirection: "North (facing Mt. Hood from the south end of the lake) [General knowledge/Map context]",
      lensesNeeded: "Wide-angle lenses are common; the guide specifically mentions using a 24mm lens for the featured shot of Mt. Hood. Photographer\'s Trail Notes",
      equipmentNeeded: "Tripod (for sunrise/reflections), comfortable hiking footwear (boots, running shoes, or sandals), sun protection (hat, SPF 30+), reusable water bottle, lightweight rain jacket. For winter: waterproof boots, hiking poles, and potentially snowshoes. Gracefkim, AwayGoWe",
      permits: "A Day Use fee or Northwest Forest Pass is required for the Day Use Area. From mid-fall to mid-spring, an ODOT Sno-Park Permit is required and must be purchased in advance. AwayGoWe",
      directions: "From Portland, head east on U.S. 26 toward Government Camp. Continue 2 miles past Government Camp to the turnoff for Trillium Lake Day Use/Campground (NF-2656) on the right. Drive 1.8 miles on NF-2656 to the Day Use parking lot. In winter, park at the Sno-Park lot at the intersection of U.S. 26 and NF-2656. AwayGoWe",
      camping: "Trillium Lake Campground is located nearby and is very popular; reservations are recommended weeks in advance. 10Adventures, Gracefkim",
      lodging: "Nearby options include Timberline Lodge and various accommodations in Government Camp. AwayGoWe",
      restaurants: "Various restaurants are available in the nearby community of Government Camp. AwayGoWe",
      cellService: "Not explicitly detailed, but listed as a membership data point. Typical of the Mt. Hood National Forest area near Government Camp, service may be spotty. Photographer\'s Trail Notes",
      weather: "Mornings are often cold even in June. Rain can occur unexpectedly. Winter months are snowy and require proper cold-weather gear. AwayGoWe",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/trillium-lake",
      photos: []
    },
    {
      name: "Bandon Beach",
      nearbyTown: "Bandon, Oregon (the beach is located within and immediately south of the town). StateParks.Oregon.gov",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "43.1103865",
      lng: "-124.4367821",
      elevation: "Sea level. Photographer\'s Trail Notes",
      trailDifficulty: "Moderate (Rated 2 out of 5). The access involves walking down approximately 50-75 stair steps to reach the sand. The primary photography beach runs for about 1 mile and is easy to navigate unless it is high tide. Photographer\'s Trail Notes",
      bestTimeOfDay: "Sunset is the premier time for photography at Bandon Beach, offering dramatic lighting and colors. Golden hour and blue hour (approximately 20 minutes before sunrise) also provide soft, tranquil light. Scouting the area before sunset is highly recommended to find optimal compositions. Photographer\'s Trail Notes",
      bestTimeOfYear: "Spring and fall are preferred to avoid summer crowds and heavy fog. Winter is a favorite for dramatic stormy images and gray whale watching (peak migration is late December). Summer offers the lowest tides for tidepooling but can be prone to thick marine layers. Don Geyer Blog",
      photographyTips: "Focus on iconic sea stacks such as Merlin’s Hat (Wizards Hat) and Face Rock. Use long exposures to create a silky effect on the ocean flow. Scout the area at low tide to find unique compositions. It is often better to photograph the water as it recedes (moves out) for a cleaner look. Create visual space between rock formations and experiment with different tripod heights to isolate subjects. In flat light, consider monochrome processing to emphasize the texture of the sea stacks. Photographer\'s Trail Notes Additional notes: Sneaker waves are a significant hazard on the Oregon coast; always keep an eye on the ocean. High tide can make certain parts of the beach inaccessible or dangerous. Wait for the perfect sunset, as conditions can be unpredictable but spectacular. Long exposures are highly recommended for capturing the silky movement of the tide around the sea stacks. Photographer\'s Trail Notes",
      shotDirection: "Generally West toward the Pacific Ocean for sunsets. South-facing shots from specific parking areas can highlight the Wizards Hat. Photographer\'s Trail Notes",
      lensesNeeded: "Focal lengths from 16mm to 85mm are recommended. 24mm is frequently used for standard compositions, while ultra-wide lenses (16mm or wider) are ideal for star photography or expansive seascapes. Photographer\'s Trail Notes",
      equipmentNeeded: "Tripod (mandatory), Neutral Density (ND) filters, Graduated ND (GND) filters (including 2 and 3-stop Reverse GND), waders (highly recommended to keep feet dry), walking stick, rain sleeve, and panorama equipment. Photographer\'s Trail Notes Pricing",
      permits: "No special photography permits are typically required for personal use. Face Rock State Scenic Viewpoint offers free public parking, though nearby state parks like Bullards Beach may require a day-use fee. Photographer\'s Trail Notes",
      directions: "The primary photography area is a 1-mile stretch of beach located just south of the Face Rock State Scenic Viewpoint. From Bandon, drive south on Beach Loop Drive to reach the various access points including Coquille Point and Face Rock Viewpoint. Bandon is approximately 100 miles north of Crescent City, CA, and 250 miles south of Portland, OR, via US Highway 101. Pamphotography",
      camping: "Bullards Beach State Park (2 miles north of Bandon), Bandon By The Sea RV Park, Coquille River RV Park, and Dew Valley Ranch Nature Retreat. Tripadvisor",
      lodging: "Best Western Inn at Face Rock (5-minute drive from the beach), Bandon Inn, and Bay Point Landing (nearby Coos Bay). Pamphotography",
      restaurants: "Lord Bennett\'s (with ocean views), Bandon Fish Market, The Loft, and Tony\'s Crab Shack. Tripadvisor",
      cellService: "Generally available and reliable throughout the Bandon Beach area due to its proximity to the town of Bandon. Photographer\'s Trail Notes",
      weather: "Unpredictable and variable. Wind and fog (marine layer) are common, especially in summer. Winter can be cold, rainy, and stormy, providing dramatic conditions but requiring proper layering and waterproof gear. Don Geyer Blog",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/bandon-beach",
      photos: []
    },
    {
      name: "Lower Lewis Falls",
      nearbyTown: "Cougar, WA (approx. 15-30 mins); Amboy, WA; Woodland, WA (approx. 1 hour).",
      state: "Washington",
      region: "Pacific Northwest",
      lat: "46.1022",
      lng: "-121.9065",
      elevation: "1,454 Ft.",
      trailDifficulty: "3.5 out of 5. While the hike to the viewpoint is easy, reaching the water level requires \'Level 3\' hiking skills, including descending a 10-15 foot steep bank using hands, knees, or a climber\'s rope (often found on-site). The rocks in the riverbed are extremely slippery.",
      bestTimeOfDay: "Early morning, late afternoon (around sunset), or on cloudy days when there is no direct light on the falls. The falls face west, meaning they are shaded in the morning, which is ideal for photography.",
      bestTimeOfYear: "Spring and early summer are best for witnessing the full power and \'roar\' of the falls. Late September through October is excellent for capturing autumn foliage colors.",
      photographyTips: "Use a Neutral Density (ND) filter to achieve shutter speeds between 1 and 10 seconds. A 1-second exposure is typically enough for a creamy effect on the falls, while 5-10 seconds is better for the foreground water. Be prepared to stand in ankle-to-knee-deep water to find the best compositions. Be aware of unphotogenic logs that often accumulate on the right side of the falls. Focus on the left-hand side for cleaner cascades. Avoid direct sunlight to prevent high contrast. Additional notes: The rocks at the base of the falls are extremely slippery; walking through the water is often safer than trying to stay on the edge. Forest Road 90 (NF-90) is paved but contains unexpected deep dips and divots that can cause low-clearance vehicles to bottom out. Many photographers use a composite technique to manage leaf movement during the long exposures required for silky water.",
      shotDirection: "West (the falls face west).",
      lensesNeeded: "Wide-angle or standard lenses. Example images provided in the guide were shot at focal lengths such as 40mm.",
      equipmentNeeded: "Tripod, Neutral Density (ND) filters (1-10 stops), muck boots or waders (to handle slippery rocks and standing in water), sturdy hiking boots, and a vehicle capable of handling rough paved roads with deep dips.",
      permits: "A day-use parking reservation is required from June 15th to September 2nd, which must be reserved in advance at Recreation.gov. A Northwest Forest Pass or equivalent is also required for parking within the Gifford Pinchot National Forest.",
      directions: "From I-5 at Woodland, WA: Take Highway 503 East (Lewis River Road), which eventually becomes Forest Road 90. Continue approximately 30 miles past the town of Cougar to the Lower Lewis Falls Recreation Area. Alternate route from I-84: Cross the Bridge of the Gods at Cascade Locks, take Highway 14 East to Wind River Highway (north), follow to NF-30, then take Curly Creek Road to the intersection with NF-90.",
      camping: "Lower Lewis Falls Campground is located directly adjacent to the falls. Lone Fir Resort in Cougar offers RV and tent camping as well.",
      lodging: "Lone Fir Resort in Cougar, WA (approx. 15-30 mins away) offers lodge rooms and cabins. More traditional hotels are located in Woodland, WA (approx. 1 hour away).",
      restaurants: "Lone Fir Cafe and Cougar Bar & Grill, both located in Cougar, WA.",
      cellService: "None; cell service is reported as zero or extremely spotty in this remote area. Offline maps are highly recommended.",
      weather: "Cloudy or overcast weather is preferred for photography to manage contrast. The area is typical of the Pacific Northwest with frequent rain. Roads may be difficult or gated during late fall and winter seasons.",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/lower-lewis-falls",
      photos: []
    },
    {
      name: "Panther Creek Falls",
      nearbyTown: "Carson, Washington (approx. 13 miles / 20 minutes). Stevenson, Washington is also nearby (approx. 7 miles from Carson). Photographer\'s Trail Notes",
      state: "Washington",
      region: "Pacific Northwest",
      lat: "45.8674",
      lng: "-121.8263",
      elevation: "1,878 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "Rated 2 out of 5. The hike to the upper viewing area is a short walk (approx. 200-300 yards) from the parking lot. The hike to the base is slightly more challenging but manageable via a maintained path with a viewing stand. Photographer\'s Trail Notes The trail can be slippery and steep, particularly the lower section. WTA",
      bestTimeOfDay: "This location is best photographed when no direct sunlight hits the scene, which means early morning, late afternoon, or on an overcast day. Photographer\'s Trail Notes Some photographers suggest 10:00 AM – 12:00 PM to catch a soft glow at the top of the larger cascade if lighting permits. Fototripper",
      bestTimeOfYear: "Late spring is recommended for high water volume and maximum greenery. Instagram - Trailhaven Autumn offers warmer colors, while winter can provide a unique shot of a partially frozen cascade with icicles. Fototripper Summer typically has the lowest flow. Photographer\'s Trail Notes",
      photographyTips: "Use a polarizing filter to slow shutter speeds and enhance greens. Keep lens wipes ready as the mist is constant; wipe the lens immediately before firing the shutter. Use a lens hood and consider a hat or hand to shield the lens between shots. Shoot from the viewing platforms (upper and lower) for different perspectives. For the tall, narrow scene of both falls, consider a vertical panorama. Abstract close-ups of the complex water patterns can be very effective. Always stay on the boardwalk to protect the ecosystem. Photographer\'s Trail Notes Fototripper Additional notes: A memorial at the upper viewpoint honors someone who died at the falls. Visitors are strongly advised to stay on the trail and behind safety railings due to steep drop-offs and slippery conditions. In June 2023, signs were posted instructing visitors to stay on the boardwalk to restore damage from foot traffic. Photographer\'s Trail Notes",
      shotDirection: "The primary cascading falls are on a west-facing cliff, meaning shots are generally directed east or northeast. Photographer\'s Trail Notes",
      lensesNeeded: "To capture both falls together, an extreme wide-angle lens (11-16mm) is needed. Alternatively, a 24mm or wider lens can be used for a vertical panorama stitch. A 50mm lens is suitable for tighter shots of the cascades. Perspective control lenses are also beneficial for managing the tall scene. Photographer\'s Trail Notes",
      equipmentNeeded: "A steady tripod and an easy-to-use head are essential for long exposures. A circular polarizing filter is required to reduce glare and saturate colors. Due to constant mist, bring a large lens hood, a rain cover for the camera, and plenty of lens wipes. Waders or boots are recommended for those planning to shoot from the creek bed. Fototripper Photographer\'s Trail Notes",
      permits: "No permits or parking passes are required at this trailhead. Friends of the Columbia Gorge Adventures PNW",
      directions: "From Carson, Washington, travel northwest on Wind River Road for about 5.8 miles. Turn right onto Old State Road, then immediately turn left onto Panther Creek Road (NF-65). Continue on NF-65 for approximately 7.5 to 8 miles until you see a large, unassuming gravel pull-out (a former quarry) on the right. Photographer\'s Trail Notes The trailhead is across the road from the parking area, marked by a white arrow on the pavement. Adventures PNW",
      camping: "Panther Creek Campground (approx. 4 miles away) is a common choice, located where the Pacific Crest Trail meets Panther Creek. Hipcamp Other nearby options include Moss Creek, Paradise Creek, and Sunset Falls campgrounds. Recreation.gov",
      lodging: "Carson Ridge Luxury Cabins in Carson, WA offer high-end accommodations nearby. Carson Ridge Skamania Lodge in Stevenson (approx. 13 miles away) is another major option. Tripadvisor",
      restaurants: "Backwoods Brewing Company, Blue Collar Cafe, and La Gula Mexican Food are popular options in Carson. Tripadvisor Stevenson offers more choices like Walking Man Brewing and Big River Grill. Carson Ridge",
      cellService: "Cell service is generally spotty or non-existent at the falls. Verizon may have limited service at nearby campgrounds, while T-Mobile is reported to have poor or no reception in the area. Hipcamp",
      weather: "The area is moist and cool due to the dense forest and waterfall spray. Rain or overcast conditions are ideal for photography to avoid harsh contrast. Fototripper Watch for slippery roots and stumps on the trails. Really Right Stuff",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/panther-creek-falls",
      photos: []
    },
    {
      name: "Spirit Falls",
      nearbyTown: "Stevenson, WA (14.3 miles south) and Cascade Locks, OR (18.5 miles west). Photographer\'s Trail Notes",
      state: "Washington",
      region: "Pacific Northwest",
      lat: "45.7261361",
      lng: "-121.6338028",
      elevation: "184 ft. Photographer\'s Trail Notes",
      trailDifficulty: "DIFFICULT TO HARD. Rated 3 to 4 on a scale of 1-5. The hike is approximately 1/2 mile each way but is very steep with a 500 ft elevation change and features loose gravel. Hiking boots with good grip and carrying water are strongly recommended. Reaching the water level is described as EXTREME. Photographer\'s Trail Notes",
      bestTimeOfDay: "The best time to shoot is either on an overcast day or early morning before the sun hits the falls. Once the sun is out, the contrast becomes very high, making it difficult to capture a good shot. Photographer\'s Trail Notes",
      bestTimeOfYear: "Spring, summer, and fall are all good times to photograph the falls. Fall is considered the best time as peak autumn colors can take the scene from great to spectacular. Photographer\'s Trail Notes",
      photographyTips: "The shot from the water level is highly difficult to obtain and involves a risky descent down a steep ravine over wet, slick rocks and logs. It is strongly recommended not to attempt this alone. Once at the river level, photographers must find a safe spot among large, slippery boulders. Alternatively, the falls can be easily photographed from the end of the trail without the extreme hike. Using a vertical panoramic technique (e.g., stitching 3 vertical shots) is a suggested method for capturing the full scene. Photographer\'s Trail Notes Additional notes: Spirit Falls is a thrilling and magical spot hidden in one of the many ravines in the Columbia River Gorge. The falls are very difficult to get to and this location is not recommended for most people. If you can make the hike, the amazing beauty, serenity, and cool water mist makes the falls a place you will never forget. Spirit Falls is one of the most beautiful places in the Columbia Gorge and can get busy at times despite the difficult access. Warnings include: the hike to the water level is EXTREME, rocks and logs can be wet, slick, and dangerous, and it is strongly suggested not to attempt the descent to the water level alone.",
      shotDirection: "Northeast at 39°. Photographer\'s Trail Notes",
      lensesNeeded: "For photographing from the end of the trail, a 50-150mm lens is suggested. For photographing from the water level, a wide-angle lens (11-17mm range) or a panoramic setup is recommended. Photographer\'s Trail Notes",
      equipmentNeeded: "Tripod, polarizer, and a neutral density (ND) filter to achieve silky water flow. Rain gear and a rain sleeve for your camera are essential due to heavy rain and mist/spray from the falls. A lens cloth is needed to wipe down the lens. Panoramic equipment is recommended if you plan to stitch shots. Photographer\'s Trail Notes",
      permits: "Currently, there are no permits required to visit this location. Photographer\'s Trail Notes",
      directions: "From Stevenson, WA, drive approximately 12 miles east on WA-14 and take a LEFT (north) onto Cook–Underwood Rd. Travel 2 miles until you see a pullout/parking area on the right side of the road. From the pullout/parking area, look for a trail to the east and follow it down to the river. Listen for the sound of the falls to guide you. The trail is steep and is a worn path rather than a maintained trail. Reaching the water level requires walking, hiking, or sliding down a steep ravine over rocks that are very slippery when wet. Photographer\'s Trail Notes",
      camping: "Eagle Creek campground (20 miles west in Oregon) and Ainsworth State Park (20 miles west in Oregon). Photographer\'s Trail Notes",
      lodging: "Skamania Lodge (866-571-0605) at 1131 SW Skamania Lodge Way, Stevenson, WA; Columbia Gorge Riverside Lodge (509-427-5650) at 3200 SW Cascade Ave, Stevenson, WA; and Best Western Plus Columbia River Inn (509-427-7700) at 735 Wa Na Pa St, Cascade Locks, OR. Photographer\'s Trail Notes",
      restaurants: "Big River Grill (509-427-4888) at 192 2nd St, Stevenson, WA; Joe’s El Rio Mexican Café (509-427-4479) at 193 2nd St, Stevenson, WA; Cascade Locks Ale House (541-374-9310) at 500 NW Wanapa St, Cascade Locks, OR (known for GREAT pizza); and Thunder Island Brewing Co (971-231-4599) at 515 NW Portage Rd, Cascade Locks, OR. Photographer\'s Trail Notes",
      cellService: "Verizon cell service is spotty at this location. Photographer\'s Trail Notes",
      weather: "The area receives a great deal of rain, requiring rain gear. It can be very hot in the summer and cold in the winter. Photographer\'s Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/spirit-falls",
      photos: []
    },
    {
      name: "Palouse Falls",
      nearbyTown: "Washtucna (7 miles), Colfax (approx. 50 miles), Spokane (approx. 100 miles). Inland NW Routes | Joe Becker Photography",
      state: "Washington",
      region: "Pacific Northwest",
      lat: "46.663588",
      lng: "-118.223533",
      elevation: "761 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "MODERATE (Rating 1/5). The hike to the main viewpoints is an easy 200-yard walk from the parking area. However, it is rated moderate due to the extreme danger of standing on the high, unfenced cliff edges (100-250ft drops) to get the best compositions. Photographer\'s Trail Notes | Washington Trails Association",
      bestTimeOfDay: "Sunset is considered the premier time, though the window is very short as light changes rapidly. Golden hour provides optimal lighting. For shadow-free images of the canyon rim, visit between 11:00 AM and 3:00 PM. Sunrise is difficult as the falls are in deep shade and the sun can cause lens flare and light up the mist. The Milky Way is also popular at night. Joe Becker Photography | Washington Trails Association",
      bestTimeOfYear: "April through early July is best for peak water flow and green hills. Spring also offers blooming wildflowers. Winter can be spectacular if the falls freeze. September and October are recommended for Milky Way photography. Photographer\'s Trail Notes | Facebook Guide",
      photographyTips: "There are three primary shooting locations on the rim: a rock peninsula (room for 1-2) and areas to its left and right (room for 3-5 each). To include both the falls and the S-curve of the gorge, photographers must stand very close to the cliff edge. Use a split-ND filter to control high contrast between the sky and the dark canyon. At night, light paint the falls with a spotlight. Marmots in the area provide good wildlife photography opportunities. Photographer\'s Trail Notes | Joe Becker Photography Additional notes: The iconic Palouse Falls is the official waterfall of Washington State, falling 200ft into a glacier-cut bowl. Note that all trails to the base of the falls were permanently closed by Washington State Parks in early 2022 due to safety concerns and multiple accidents. Visitors should remain behind fences and be extremely cautious of the sheer 100-250ft drops. Rattlesnakes are common in the area. Photographer\'s Trail Notes | Washington Trails Association",
      shotDirection: "The falls face West-Southwest. Primary shots are taken facing East toward the falls or South down the canyon. Joe Becker Photography",
      lensesNeeded: "Wide to super-wide lenses are essential. 11mm to 35mm is recommended. To capture both the falls and the downstream canyon in a single full-frame composition, a lens of 18mm or wider is often needed. Photographer\'s Trail Notes | Joe Becker Photography",
      equipmentNeeded: "Tripod, split-neutral density (ND) filters or HDR techniques to manage contrast, wide-angle lenses, spotlight for light painting at night, and plenty of water. Photographer\'s Trail Notes | Joe Becker Photography",
      permits: "A Washington State Discover Pass is required for parking ($10/day or $30/annual). An automated pay station is available on-site. Overnight photography may require a camping permit ($12). Tripadvisor | Facebook Permit Info",
      directions: "From Spokane: Take I-90 West to Ritzville, then South on Hwy 261 to Washtucna. Continue Southwest on Hwy 261 for approximately 7 miles to the Palouse Falls sign, then follow the 2-mile gravel/dirt road to the parking lot. From Colfax: Travel West on Hwy 26 to Washtucna (approx. 50 miles), turn left onto Hwy 261 and follow signs. Rod Barbee Photography | Inland NW Routes",
      camping: "Palouse Falls State Park has 11 primitive tent sites (no trailer hookups) within 100 meters of the viewpoints. Lyons Ferry State Park is a nearby alternative with more amenities. Joe Becker Photography",
      lodging: "Colfax (approx. 1 hour 45 min away) offers hotels such as the Best Western Wheatland Inn. Limited options are available in Washtucna or Ritzville. Rod Barbee Photography | Joe Becker Photography",
      restaurants: "A shaved ice food truck is sometimes present at the park. Most dining options are in Washtucna or Colfax. Tripadvisor",
      cellService: "There is generally no cellular reception at the park. Tripadvisor",
      weather: "Desert climate with hot summers (often 90°F+) and limited shade. Arid plains environment. Rattlesnakes are a seasonal hazard. Tripadvisor | Washington Trails Association",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/palouse-falls",
      photos: []
    },
    {
      name: "Thor's Well",
      nearbyTown: "The closest town is Yachats, OR (4 miles north). Larger towns include Newport (26 miles north) and Florence (24 miles south).",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.278425",
      lng: "-124.1134861",
      elevation: "Sea Level",
      trailDifficulty: "EXTREME - The hike from the parking lot to Thor’s Well is a modest ¼ mile downhill, but the circumstances around this shot ARE VERY DANGEROUS AND NOT FOR EVERYONE! To make this shot work, you have to be standing very close to Thor’s Well when the ocean tide is raging.",
      bestTimeOfDay: "Late afternoon, evening, or sunset. The shot is dictated by the tide; the best time is 1 hour before and after high tide. Note: for most times of the year, high tide is too much water and EXTREMELY DANGEROUS!",
      bestTimeOfYear: "The ocean/beach is not greatly affected by the time of year. Sunset is to the left of the shot in the summer and to the right in the winter. The featured shot was taken on October 22nd.",
      photographyTips: "This shot is all about the tide level; if it is low, the location is just a hole in the basalt rock. A shutter speed of ½ second is usually perfect for creating silky flow into the hole. Always be alert for rogue waves that can splash over the hole and onto your gear. EXIF data for the reference shot: 24mm, 1/2 sec @ f 16.0, ISO 100. Additional notes: DANGER: This location is very dangerous due to surging tides and potential rogue waves. Always check Tide Charts for Yachats, OR. The location can be moderately busy with tourists, but usually only a handful of photographers at prime time. It is a collapsed sea cave about 12-15ft across.",
      shotDirection: "West at 270°.",
      lensesNeeded: "24mm (used for featured shot). Anything from 16mm to 35mm depending on the composition.",
      equipmentNeeded: "Tripod, neutral density (ND) filter, protection for camera (lens hood and/or plastic cover), and plenty of lens cloths to wipe away salt water mist.",
      permits: "There are no permits required.",
      directions: "Driving directions to Thor’s Well parking area. From the parking lot, walk down the switchbacks to the stairs. Go down the stairs and take a right and walk along the wall for about 50 ft. From this spot, walk straight out to a raised set of rock in front of the Thor’s Well.",
      camping: "Cape Perpetua Campground (.5 miles north of Thor’s Well).",
      lodging: "Overleaf Lodge & Spa (800) 338-0507, 280 Overleaf Lodge Ln, Yachats, OR; Deane\'s Oceanfront Lodge (541) 547-3321, 7365 US-101, Yachats, OR; Fireside Motel (541) 547-3636, 71881 US-101, Yachats, OR.",
      restaurants: "The Drift Inn (541) 547-4477, 124 US-101, Yachats, OR (good food, fast Wi-Fi); Ona Restaurant and Lounge (541) 547-6627, 131 US-101, Yachats, OR (upscale); Luna Sea Fish House (541) 547-4794, 153 NW Hwy 101, Yachats, OR.",
      cellService: "Verizon cell service at this location is spotty at best.",
      weather: "Mild in spring, summer, and fall. Annual rainfall is about 75 inches. The coastline is often affected by the marine layer (dense fog).",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/thors-well",
      photos: []
    },
    {
      name: "Punch Bowl Falls",
      nearbyTown: "Cascade Locks, OR (3 miles east) and Stevenson, WA (located across the river).",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "45.6228639",
      lng: "-121.8952778",
      elevation: "44 Ft Elevation",
      trailDifficulty: "MODERATE TO CHALLENGING. Rated 3 on a scale of 1-5. The 1.8-mile hike is on the Eagle Creek trail, but the final 1/4 mile descent to the Lower Punch Bowl Falls is steep and can be slippery.",
      bestTimeOfDay: "Early morning (an hour or so after sunrise) is considered the best time. There is a specific window where sunlight peaks through the water spout, creating a soft light that only lasts for a few minutes.",
      bestTimeOfYear: "Spring, summer, and fall are all good times. Late fall is especially recommended for the spectacular fall colors in the Columbia River Gorge.",
      photographyTips: "There are two classic vantage points: Upper (from above) and Lower (from below). Compositions can range from wide-angle to compression shots. A preferred shot involves capturing sunlight peaking through the water spout, which requires precise timing as the soft light only lasts a few minutes. Using a polarizer is key to managing glare on the water, and an ND filter helps create the silky water effect. Wading into the creek can provide unique perspectives. Additional notes: The location is very popular with tourists and photographers; arriving early is recommended to avoid crowds. The trail is part of the Eagle Creek trail system which was affected by the 2017 Eagle Creek Fire, so hikers should be aware of potential hazards like falling rocks or unstable terrain. USDA Punchbowl Falls and Recreation.gov - Eagle Creek Campground provide additional local information.",
      shotDirection: "South at 160°.",
      lensesNeeded: "50mm lens was used for the main featured shot. Wide angle, standard, and compression lenses are all useful depending on the desired composition.",
      equipmentNeeded: "Tripod, polarizer (to reduce glare from the creek), and a neutral density (ND) filter (to achieve shutter speeds of 1/2 second or longer). Consider waders or wet shoes and micro spikes for walking/wading in the creek. Rain gear is essential due to high rainfall in the area.",
      permits: "A National Forest Pass is required. A day pass costs $5.",
      directions: "From Portland, OR, travel east on I-84 for approximately 35 miles and take exit 41 (Eagle Creek Ln). From the parking lot, walk about 1/2 mile south along a paved one-lane road following Eagle Creek to the end where the trailhead is on the left. Hike up the trail for about 1.8 miles. Look for a large opening on the right and a sign for “Lower Punch Bowl Falls.” Follow the trail down to the riverbed and walk straight for about 60 yards around the bend to reach the falls. Driving Directions to Trailhead",
      camping: "Eagle Creek Campground (just off the trail) and Ainsworth State Park.",
      lodging: "Cascade Locks, OR (3 miles east). Cascade Locks Ale House area.",
      restaurants: "Cascade Locks Ale House (541-374-9310), Thunder Island Brewing Co (971-231-4599), Big River Grills (509-427-4888), and El Rio Mexican Cafe (509-427-4479).",
      cellService: "There is NO cell service at the location (tested with Verizon). Service becomes available once you get closer to the highway.",
      weather: "The area experiences significant rainfall, so rain gear is a must. Temperatures can be very cold in winter and very hot in summer. Current Weather",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/punch-bowl-falls",
      photos: []
    },
    {
      name: "Smith Rock",
      nearbyTown: "Terrebonne (on-site), Redmond (10 miles south), and Bend (21 miles south). Source",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.3663361",
      lng: "-121.1374833",
      elevation: "2,693 Ft Source",
      trailDifficulty: "1 on a scale of 1-5 (EASY). The photographic area is just an easy 75-yard walk from the main parking lot. Source",
      bestTimeOfDay: "Sunset is the most popular shot for photographers, especially when clouds are present to be illuminated by the setting sun. However, the red glow of sunrise can also produce excellent photographs. Source",
      bestTimeOfYear: "Smith Rock can be photographed year-round. In summer, the sun sets behind the rock (creating a silhouette) and rises to the right. In winter, the sun sets to the left (illuminating the front/side of the rock) and rises directly in front of it. Source",
      photographyTips: "Arrive at least an hour before sunset to explore compositions. The most iconic shot involves capturing the S-curve of the Crooked River as a foreground element to the massive rock face. The location is an easy walk from the parking lot, making it accessible for many. Source Additional notes: This location is simple to get to and provides a great opportunity for a nice landscape shot, so expect to see several other photographers at sunset. The location is known for the S-shape of the Crooked River running in front of the massive rock formations. Source",
      shotDirection: "West at 260°. Source",
      lensesNeeded: "Focal lengths from 24mm to 50mm are recommended depending on the desired composition. Source",
      equipmentNeeded: "A tripod is recommended. No other special photography equipment is needed unless planning for panoramic shots. Proper cold weather clothing is advised for spring, fall, and winter. Source",
      permits: "No specific permits are required, but there is a $5 per vehicle per day parking fee. Source",
      directions: "From Bend, OR: Drive north on US-97 for 21 miles to Terrebonne. Turn right onto Smith Rock Way for 0.5 miles, then turn left onto 1st St./Lambert Rd. for 2 miles. Turn left onto Crooked River Dr. to enter Smith Rock State Park. Drive past the camping area to the main parking lot. From there, take the gravel path next to the information/fee sign for 25 yards, turn left, and walk another 25 yards to reach the photographic area. Source",
      camping: "The Bivy is a tent-only, first-come, first-served campsite within Smith Rock State Park (no RVs or car camping allowed). Skull Hollow Campground is another option located 8 miles northeast of the park. Source",
      lodging: "Nearby lodging is available in Redmond (10 miles south), including the Best Western Plus Rama Inn (2630 SW 17th Pl) and Sleep Inn & Suites (1847 N Hwy 97). Source",
      restaurants: "In Redmond, Diego\'s Spirited Kitchen (447 SW 6th St) is highly recommended for dinner and service. Wild Ride Brewery (332 SW 5th St) is another local option. Bend is also noted as a major craft brew hub with many dining choices. Source",
      cellService: "Good cell coverage is available at the location; the guide mentions good service with Verizon. Source",
      weather: "The area is arid and receives less rain than other parts of Oregon. It can be cool in spring and fall, and winters are typically cold. Source",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/smith-rock",
      photos: []
    },
    {
      name: "Portland Japanese Garden",
      nearbyTown: "Portland, OR (The garden is located in Washington Park, just west of downtown).",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "45.5187",
      lng: "-122.7083",
      elevation: "553 ft.",
      trailDifficulty: "EASY: Rated 1 on a scale of 1-5. The location is an easy 300-yard walk from the parking lot/shuttle drop-off on well-maintained paved or gravel paths. Some elevation change is present but the primary photo spots are very accessible.",
      bestTimeOfDay: "Mid-morning for light rays in Autumn (sun typically reaches the garden interior close to midday). Early morning is recommended for capturing fog and avoiding crowds. Photography members get exclusive access an hour before the general public, which is ideal for early morning or late evening light.",
      bestTimeOfYear: "Autumn (mid-to-late October) is peak for the fiery colors of the Japanese maples. Spring (April-May) is best for azaleas, cherry blossoms, and lush greens. Winter can provide dramatic fog and occasional snow, while Summer features iris blooms and wisteria.",
      photographyTips: "To capture the \'Famous Tree\' (Laceleaf Japanese Maple), you must shoot from a very low perspective, often sitting on the paved walkway directly in front of and below the tree. Focus on the kontorted branch shapes and the vibrant leaf colors. Use a polarizer even on cloudy days to pop the colors and eliminate reflections. Overcast or rainy days are actually preferred as the soft light enhances the saturation and mood of the garden. Explore beyond the main tree to find compositions at the Moon Bridge, Heavenly Falls, and the various stone lanterns throughout the 12-acre site. Photographer\'s Trail Notes provides exhaustive composition and technical advice. Additional notes: The guide mentions that the Portland Japanese Garden is extremely well-maintained and visitors must stay on paved paths; stepping on the moss is strictly prohibited and gardeners are known to groom it with tweezers. During peak autumn, lines of photographers often form at the \'Famous Tree\' (a Japanese maple), and a 15-minute rotation policy may be in effect. Tripods require a specific fee or a photography membership. The Umami Cafe is located within the Cultural Village for snacks and tea.",
      shotDirection: "For the famous maple tree, the shot is generally facing West/Northwest into the canopy. From the Pavilion terrace, the classic view of Mount Hood faces East. Photographer\'s Trail Notes includes a \'Direction of Shot\' data point for members.",
      lensesNeeded: "Ultrawide to wide-angle lenses (11mm to 28mm) are primary for the famous Japanese maple tree. Mid-range zooms (24-70mm) are useful for general garden compositions. Telephoto lenses (70-200mm) can be used for compression or detail shots of lanterns and architecture, though 200mm+ is rarely necessary.",
      equipmentNeeded: "Tripod (required for long exposures, subject to a $5 fee for non-members), Polarizing filter (essential for removing glare from leaves and water), Rain cover for camera, Mini tripod (for extremely low-angle shots of the maple tree), Knee pads (highly recommended for the low shooting position required for the tree), Lens cleaning kit (to manage mist and water particles).",
      permits: "Admission fee required (~$19.95 - $21.95 for adults). A $5 tripod fee applies unless you have a Photography Membership. Commercial photography and workshops require advance permits and specific membership levels. Portland Japanese Garden handles all permitting.",
      directions: "From downtown Portland, travel West on Sunset Highway (US 26). Follow signs for the Oregon Zoo and Washington Park. Drive past the Zoo and follow signs to the Portland Japanese Garden. Parking is available in the Washington Park lots (pay-to-park). A 5-minute hike or a shuttle bus leads from the lower parking area to the Garden entrance. Photographer\'s Trail Notes provides detailed road-by-road instructions.",
      camping: "While there is no camping directly in Washington Park, nearby options include Stub Stewart State Park (~33 miles NW) and various private RV parks in the Portland metro area. Photographer\'s Trail Notes provides a specific curated list for members.",
      lodging: "Nearby hotels include Hotel Deluxe (1.0 mi), Park Lane Suites & Inn (0.7 mi), and Inn at Northrup Station (1.1 mi).",
      restaurants: "Umami Cafe (located inside the garden), Elephants Delicatessen (0.7 mi), RingSide Steakhouse (0.7 mi), and various options in the nearby Northwest 23rd Avenue shopping district.",
      cellService: "Generally reliable cell service is available throughout Washington Park and the Japanese Garden due to its proximity to downtown Portland.",
      weather: "Temperate and often wet. Portland is known for frequent overcast skies and light rain, which provide ideal \'soft box\' lighting for garden photography. Fog is common in autumn and winter mornings. Temperatures are mild, but winters can bring occasional frost or rare snow.",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/japanese-garden",
      photos: []
    },
    {
      name: "Multnomah Falls",
      nearbyTown: "Portland (approx. 30 miles), Troutdale (approx. 15-20 minutes), and Cascade Locks. Source: Lisa Blount Photography and Photography Life",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "45.57616",
      lng: "-122.115776",
      elevation: "80 Ft. (base area). Source: Photographer\'s Trail Notes",
      trailDifficulty: "EASY (Rating: 1 on a scale of 1-5). The primary shooting platform is a very easy 100-yard walk from the parking lot. The trail to Benson Bridge is 0.2 miles (steady incline, paved). The hike to the top is 2.2 miles round-trip with roughly 700-800 ft elevation gain (moderate difficulty). Source: Photographer\'s Trail Notes and Friends of the Columbia Gorge",
      bestTimeOfDay: "Early morning (sunrise or before 8:00 AM) or late evening to avoid crowds and get soft, even lighting. Cloudy/overcast days are preferred for a \'moody\' look and to manage dynamic range, as direct sunlight on sunny days can create harsh shadows and high contrast. Source: Photographer\'s Trail Notes and Sasquatch Shuttle",
      bestTimeOfYear: "Year-round, with seasonal variations: Spring (peak water flow and lush green), Summer (very lush but most crowded), Fall (stunning autumn foliage), and Winter (snowy scenes and ice, though the bridge may close). Source: Photographer\'s Trail Notes and Inked with Wanderlust",
      photographyTips: "Straightforward shot from the main viewing platform; use a tripod and ND filter for long exposures (5-10+ seconds) to create silky water and blur out moving people on the bridge. For composition, try centering the bridge and lower falls, even if the upper falls is slightly off-center. A wider perspective (16mm) captures the full drama. Move left or right at the base to find the best angle for the bridge. Be patient with crowds and wait for clearings on the bridge. Source: Photographer\'s Trail Notes and The Dive (YouTube transcript) Additional notes: The location can be very crowded (over 2 million visitors annually). A timed-use permit is required for the I-84 Exit 31 parking lot between late May and early September. The Benson Bridge may be closed in winter if it freezes over. The Historic Columbia River Highway has been undergoing repairs (expected completion by Memorial Day 2025). Source: Photographer\'s Trail Notes and Friends of the Columbia Gorge",
      shotDirection: "South/Southwest (facing the falls from the Columbia River side). [Source: Analysis of maps/location]",
      lensesNeeded: "Wide-angle lenses are essential. 16-35mm is the most recommended range to capture the full scale. Focal lengths mentioned include 11mm, 16mm, 24mm, 29mm, and up to 35mm. Source: Photographer\'s Trail Notes and The Dive (YouTube transcript)",
      equipmentNeeded: "Tripod (highly recommended for long exposures), ND filters (neutral density, 2-5 stops or more) to achieve silky water effects, circular polarizer (to manage reflections on wet rocks), rain gear/protection for camera (mist from the falls is significant), and sturdy walking shoes. Source: Photography Life and The Dive (YouTube transcript)",
      permits: "Timed-use permits ($2 fee) are required for the I-84 Exit 31 parking lot from late May through early September (9 AM - 6 PM). No permit is required for the smaller Historic Highway lot, but it fills very quickly. Source: Friends of Multnomah Falls and Inked with Wanderlust",
      directions: "From Portland: Take I-84 East to Exit 31 (parking lot in the median) and walk under the freeway to the lodge. Alternatively, take I-84 to Exit 28 (Bridal Veil) and follow the Historic Columbia River Highway east to the falls. Source: Friends of the Columbia Gorge",
      camping: "Popular campgrounds are available in the Columbia River Gorge area, including options near Corbett and Cascade Locks. Source: Wanderlust Travel and Photos Blog",
      lodging: "Multnomah Falls Lodge (on-site). Other hotels are available in nearby Troutdale, Cascade Locks, or Portland (approx. 30-40 minutes away). Source: Inked with Wanderlust",
      restaurants: "Multnomah Falls Lodge Restaurant (regional favorites), snack bar at the lodge, and Corbett Country Market (approx. 15 minutes west). Source: Lisa Blount Photography",
      cellService: "Available (listed as a data point in the membership area). Source: Photographer\'s Trail Notes",
      weather: "Temperate rainforest climate; frequent rain and mist. Winter can bring ice and snow, making trails and the bridge very slippery. Source: Friends of the Columbia Gorge and Photography Life",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/multnomah-falls",
      photos: []
    },
    {
      name: "John Day Painted Hills",
      nearbyTown: "Mitchell, OR (approximately 9 miles northwest) PTN Preview",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.6606",
      lng: "-120.2728",
      elevation: "2,086 Ft. PTN Preview",
      trailDifficulty: "EASY: Rated 1 on a scale of 1-5. The public access area is approximately 1 mile from start to finish, with the most photographed area being an easy 1/4 mile walk from the parking lot. PTN Preview",
      bestTimeOfDay: "Late afternoon and evening (Golden Hour) are considered the best times as the hills are mostly west-facing. The colors become most vibrant 1-2 hours before sunset. Morning light can also be effective for highlighting different textures and areas. PTN Preview, NPS",
      bestTimeOfYear: "Spring, Winter, and Fall are preferred in that order. Spring offers wildflowers and rain that saturates the hill colors. Fall provides pleasant temperatures. Winter offers solitude and the possibility of snow. Summer is extremely hot and has little shade. Photo Cascadia, 2TravelDads",
      photographyTips: "Scout the location several hours before golden hour to find compositions. Use a circular polarizer to deepen the reds and yellows. The most vibrant colors appear immediately after rainfall. Capture the iconic boardwalk at Painted Cove and seek panoramic views from Carroll Rim. Use telephoto lenses to isolate patterns and colors in the hills. PTN Preview, Fresh Off The Grid Additional notes: Stay on marked trails at all times to protect the sensitive paleosoils (\"Don\'t Hurt the Dirt\"). Watch for deer and livestock on the roads, especially at dawn and dusk. Fuel up and buy supplies in nearby towns like Mitchell, as gas and food are sparse in the immediate area. NPS, Mitchell, OR Guide",
      shotDirection: "West and Northwest facing landmarks are favored for evening shots to catch the setting sun. The main overlook typically requires shooting towards the hills (facing West/Southwest). NPS, Mitchell, OR Guide",
      lensesNeeded: "Wide-angle lenses (e.g., 24-70mm) for expansive vistas, 50mm primes, and short-to-long telephoto lenses (e.g., 70-200mm or 50-400mm) for compressing the landscape and capturing detail shots of the hill textures. PTN Preview, Facebook Photography Group",
      equipmentNeeded: "Tripod (essential for low light), circular polarizer (CPL) to enhance colors, ND filters, comfortable hiking shoes, plenty of water, sunscreen, and a hat. A 4WD vehicle is recommended for accessing nearby BLM areas like Priest Hole. Painted Hills Oregon, Facebook Photography Group",
      permits: "No entrance fees or parking passes are required for the National Monument. A Special Use Permit ($50 application fee) is only required for organized activities or groups larger than 20 people. NPS, Dawn Photo",
      directions: "From Mitchell, OR: Drive west on US-26 for approximately 5 miles. Turn right (north) at the signs for John Day Fossil Beds - Painted Hills Unit onto Burnt Ranch Road. Follow Burnt Ranch Road/Bear Creek Road for about 6 miles to the park entrance. Oregon Essential, Mitchell, OR Guide",
      camping: "Options include Mitchell City Park (in Mitchell), BLM lands such as Priest Hole and BLM Hole along the John Day River, and private sites like the Painted Hills Cottages. Painted Hills Oregon",
      lodging: "Nearby options in Mitchell include the Painted Hills Cottages, The Spoke\'n Hostel, and the Oregon Hotel. Painted Hills Oregon",
      restaurants: "Tiger Town Brewing Co and the Mitchell Sidewalk Cafe are located in nearby Mitchell. Note that services are sparse and it is best to bring your own food and water. Mitchell, OR Guide",
      cellService: "Little to no cell service is available within the park units; users are advised to download maps for offline use. Mitchell, OR Guide, Painted Hills Oregon",
      weather: "High desert climate with extreme temperatures. Summers often reach 90°F-100°F+ with no shade. Winters can be below freezing and may feature snow. High winds are common on ridges like Carroll Rim. Dinkum Tribe, Fresh Off The Grid",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/john-day-painted-hills",
      photos: []
    },
    {
      name: "Sahalie Falls",
      nearbyTown: "McKenzie Bridge (19 miles west), Sisters (approx. 33 miles east), and Eugene/Springfield (approx. 72 miles west). Hike Oregon",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.3490101",
      lng: "-121.9970056",
      elevation: "2,861 Ft. Photographer\'s Trail Notes",
      trailDifficulty: "MODERATE AND RISKY: Rated 3 out of 5. While the walk from the parking lot is only about 200 yards, reaching the best riverbank shooting locations requires hiking down a short but serious slope. Photographer\'s Trail Notes",
      bestTimeOfDay: "The best time to shoot is early morning or late afternoon to capture soft light filtering through the trees and avoid harsh shadows or blown-out highlights on the white water. Jenn Richardson Photo",
      bestTimeOfYear: "Best flow occurs in early spring (April, May, June). The trail is accessible year-round, though winter access may require proper snow gear. Fall is also recommended for seasonal color. Hike Oregon",
      photographyTips: "Compositions can be found from the main viewing platform or by hiking down a short, steep slope to the banks of the McKenzie River (approx. 100-200 yards from the parking lot). Use a wide-angle lens for powerful direct shots or stitch vertical shots for panoramas. Experiment with both long exposures (using ND filters) for silky water and fast shutter speeds to freeze the \'thunderous energy\' of the falls. Look for contrast between the white water and vibrant green moss. Photographer\'s Trail Notes and Jenn Richardson Photo Additional notes: The guide mentions that Sahalie Falls is a powerful waterfall along the McKenzie River. While the viewing platform offers a \'postcard shot,\' the featured photo in the guide was taken about 100 yards down the trail along the riverbanks. Caution is emphasized as falling into the river would be catastrophic. The guide also notes that the intense water flow makes this a must-stop location in Central Oregon. The waterfall is approximately 73 feet tall and is the uppermost of three falls on this section of the river. Fire closures are a potential hazard in the Willamette National Forest, so checking current conditions via the USFS is recommended. Photographer\'s Trail Notes",
      shotDirection: "The McKenzie River flows generally south-southwest through this section. For the classic view of the falls from the main overlook or riverbank, photographers typically face West or North-West. Topozone",
      lensesNeeded: "Lenses ranging from 11mm to 100mm can be used depending on the composition. Wide-angle lenses (e.g., 14mm-24mm) are common for capturing the full scale, while longer focal lengths can be used for compression or detail shots. Photographer\'s Trail Notes",
      equipmentNeeded: "Sturdy tripod, lens cloths, ND filters (for long exposures), circular polarizer, and potentially waders or wet shoes if shooting from the riverbanks. Knee pads are also recommended for wet conditions. Jenn Richardson Photo",
      permits: "Permits are not required for day hikes at Sahalie Falls. Hike Oregon",
      directions: "From Eugene: Drive OR-126 east for 52.6 miles to McKenzie Bridge. Continue 19 miles east of McKenzie Bridge, near milepost 5, and turn into the marked Sahalie Falls parking lot. From Bend: Drive US-97 north to Redmond, merge onto US-20 west towards Sisters. 25.1 miles past Sisters, stay left on US-20 for 3.3 miles, then turn left onto OR-126 for 5.2 miles and turn right into the Sahalie Falls parking lot. Hike Oregon",
      camping: "The Sahalie Falls parking lot is a primary access point, and the nearby Koosah Falls parking lot also serves as a starting point for the loop. Ice Cap Campground is located nearby along the McKenzie River. Hike Oregon",
      lodging: "Nearby options include lodging in McKenzie Bridge (19 miles west) or Sisters (approx. 33 miles east). Specific mentions include the \'Loyal Shepherd BNB\' which offers winter specials. Hike Oregon and Facebook",
      restaurants: "Dining options are available in the nearby towns of McKenzie Bridge and Sisters. Hike Oregon",
      cellService: "Cell service is often unavailable at the waterfalls and in many nearby photography areas. It is recommended to let someone know your plans before arriving. Photograph Oregon",
      weather: "The area is subject to rapid weather changes. Spring and Fall see the most dramatic conditions, while winter brings snow and ice that can make the trail slippery. Forest fire closures are a seasonal hazard. Photograph Oregon and Melia In the Mountains",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/sahalie-falls",
      photos: []
    },
    {
      name: "Proxy Falls",
      nearbyTown: "McKenzie Bridge (approx. 9 miles west) and Sisters (approx. 15-20 miles east). Oregon Photo Guide",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.1616",
      lng: "-121.92743",
      elevation: "3,086 Ft. (approx. 940 meters). Photographer\'s Trail Notes Preview",
      trailDifficulty: "Rated as 3 on a scale of 1-5 (Moderate to Difficult). The trail is a 1.5 to 1.6-mile loop. The hike to the falls is a modest 0.75-mile walk through old lava flows and mixed conifer forest with a 170-200 ft elevation gain. The \'Difficult\' part involves a steep, slippery scramble down an unmaintained spur trail to reach the base of the falls, where hikers must navigate ankle-high water and slick rocks. Photographer\'s Trail Notes Preview, Oregon Photo Guide",
      bestTimeOfDay: "Early morning (before 10 AM) or late afternoon is best for soft, even lighting. The falls are west-facing and are beautifully illuminated by indirect light reflecting off the surrounding cliff walls just after sunrise. Overcast days are also ideal for waterfall photography to avoid harsh shadows and highlights. The falls and surrounding forest move into the shade of the ravine in the late afternoon. Landscape Photography Magazine, Airial Travel",
      bestTimeOfYear: "Spring (May to June) offers the best water flow and blooming rhododendrons. July still has abundant water. Fall (September to October) provides vibrant autumn colors from vine maples (yellow, orange, and red). Highway 242 typically closes from November to June due to snow, making the trailhead inaccessible by car in winter. Oregon Photo Guide, Cascade Center of Photography",
      photographyTips: "Lower Proxy Falls is over 200ft tall; don\'t feel obligated to capture the entire fall in one frame. Experiment with shooting from the front, the left, or climbing the hill on the right. Getting into the water provides unique perspectives but requires caution. Use the polarizer to make the vibrant green moss pop and remove the white glare from wet basalt. Include foreground interest such as mossy rocks, ferns, or fallen logs for depth. For Upper Proxy Falls, get close to the cascading water for intimate, \'darker pool\' atmosphere shots. Focus on sharp, mossy rocks about two-thirds into the scene rather than the moving water. Photographer\'s Trail Notes Preview, Fototripper, Jenn Richardson Photo Additional notes: The creek feeding the falls disappears into porous lava rock at the base, meaning there is no outlet stream. The area is within the Three Sisters Wilderness, where drone usage is strictly prohibited. When visiting, photographers are encouraged to \'Leave No Trace\' and help preserve the delicate moss-covered environment. The road (Highway 242) is a historic scenic byway with many tight switchbacks and is not recommended for large RVs or trailers.",
      shotDirection: "East (the falls are west-facing, so the photographer faces East to capture them). Landscape Photography Magazine",
      lensesNeeded: "Wide-angle lenses are most common for the main falls; 24mm is a popular choice, but anything from 16mm to 35mm works depending on the composition. A zoom lens (e.g., 24-105mm) is useful for more intimate shots or for Upper Proxy Falls. A tele-photo lens can be used from the lookout point. Photographer\'s Trail Notes Preview, Fototripper, Travel Oregon",
      equipmentNeeded: "A sturdy tripod is essential for long exposures. A circular polarizer is highly recommended to manage reflections on wet rocks and enhance the saturation of the green moss. Neutral density (ND) filters (3-stop to 10-stop) are useful for achieving silky water effects in brighter light. Bring lens cleaning kits/cloths to manage spray from the falls. Waterproof hiking boots with good grip are vital for the slippery, rocky scramble to the base. Waders or wet shoes are recommended for those planning to shoot from within the creek. A rain cover for camera gear is also advised. Fototripper, Jenn Richardson Photo",
      permits: "A Day Use Fee of $5 per vehicle is required, or a valid Recreation Pass (such as the Northwest Forest Pass or America the Beautiful Pass). Travel Oregon, Oregon Photo Guide",
      directions: "From McKenzie Bridge, OR, travel east on Highway 126 to the junction with Highway 242. Travel east on Highway 242 (McKenzie Pass Scenic Byway) for approximately 6.5 to 9 miles to the Proxy Falls Trailhead, which is marked by roadside signs and a restroom on the south side of the road. Eugene, Cascades & Oregon Coast, Oregon Photo Guide",
      camping: "Nearby camping is available at Alder Springs Campground and Scott Lake Campground. Oregon Photo Guide",
      lodging: "Belknap Hot Springs is the closest lodging option. Other accommodations are available in the nearby towns of McKenzie Bridge ( McKenzie Riverside Cottages) and Sisters. Photographer\'s Trail Notes Preview",
      restaurants: "Dining options are available in McKenzie Bridge (e.g., Takoda\'s Restaurant, McKenzie General Store & Obsidian Grill) and Sisters. Photographer\'s Trail Notes Preview",
      cellService: "Cell service is extremely limited or non-existent within the Three Sisters Wilderness and along much of Highway 242. Photographer\'s Trail Notes Preview",
      weather: "Temps can vary significantly. The area is subject to seasonal road closures from November to June due to heavy snow at the pass. Rainy or misty days are common and can enhance the lush greenery for photography. Oregon Photo Guide, Jenn Richardson Photo",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/proxy-falls",
      photos: []
    },
    {
      name: "Heceta Head Lighthouse",
      nearbyTown: "Florence, OR (11 miles north); Yachats, OR (13 miles south). Photographers Trail Notes",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.0",
      lng: "-124.0",
      elevation: "254 Ft Photographers Trail Notes",
      trailDifficulty: "EASY - I would rate the difficulty of this trail as a 1 on a scale of 1-5 (with 5 being most difficult). If you shoot from the beach, it is an easy 100yd walk from the parking lot, but you may have to walk through some shallow water. Photographers Trail Notes",
      bestTimeOfDay: "The ocean/beach is not greatly affected by the time of year. The sunset is to the left in the fall and winter and moves to the right in the spring and summer. Photographers Trail Notes",
      bestTimeOfYear: "The ocean/beach is not greatly affected by the time of year. Photographers Trail Notes",
      photographyTips: "There are a few different places to shoot the lighthouse: 1) on the beach, 2) behind the lighthouse and 3) from pullouts south of the entrance. On the beach, the best place is on the far left up against the cliff. The pullouts south of the entrance (2 or 3 of them) provide a great view looking north toward the lighthouse. Photographers Trail Notes Additional notes: The Heceta Head Lighthouse is the brightest light on the Oregon coast, beaming 21 miles out to sea. The coastline can often be \'socked in\' by the marine layer (dense fog), so it\'s important to check the weather before visiting. Tourists and other photographers are often present on the beach. Photographers Trail Notes",
      shotDirection: "North at 350° Photographers Trail Notes",
      lensesNeeded: "50mm lens was used for the main shot; wide-angle to telephoto depending on composition. Photographers Trail Notes",
      equipmentNeeded: "Tripod, neutral density filters (to lower shutter speed for ocean movement), and waders/wet shoes if shooting from the beach. Photographers Trail Notes",
      permits: "No permits required, but there is a daily fee of $5 per vehicle. Photographers Trail Notes",
      directions: "The Heceta Head Lighthouse is 11 miles north of Florence, OR, and 13 miles south of Yachats, OR. From Florence, OR, drive approximately 11.7 miles north on US 101 and just past a large elevated bridge. Photographers Trail Notes",
      camping: "Carl G. Washburne Memorial State Park (2 miles north); Heceta Beach RV Park & Mini Mart (11 miles south). Photographers Trail Notes",
      lodging: "Three Rivers Casino & Hotel (5647 Oregon 126, Florence, OR); Driftwood Shores Resort and Conference Center (188416 1st Ave, Florence, OR). Florence, OR has an abundance of lodging. Photographers Trail Notes",
      restaurants: "Florence, OR has plenty of good options, especially in the Old Town area. Photographers Trail Notes",
      cellService: "Spotty along the Oregon coast; hit or miss (Verizon). Photographers Trail Notes",
      weather: "Mild in the spring, summer, and fall; rains about 75 inches a year. Often \'socked in\' by the marine layer (dense fog). Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/heceta-head-lighthouse",
      photos: []
    },
    {
      name: "Ponytail Falls",
      nearbyTown: "Cascade Locks (nearest), Hood River (approx. 30 miles east), and Portland (approx. 35 miles west) (We Dream of Travel).",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "45.588578",
      lng: "-122.068425",
      elevation: "80 Ft.",
      trailDifficulty: "MODERATE (Rated 3 on a scale of 1-5). The hike on the Horsetail Falls #438 trailhead is a fairly strenuous 0.4-mile hike up a steep hill with several switchbacks. Once at the falls, you may need to hike down approximately 20 yards to the creek for the best compositions (Photographer\'s Trail Notes).",
      bestTimeOfDay: "Early morning or late afternoon and evening are best to avoid harsh sunlight, as the falls are located in a gorge that remains in shade until mid-morning (Rod Barbee Photography). Sunrise colors can sometimes be captured through the trees above (Facebook).",
      bestTimeOfYear: "Ponytail Falls is a perennial waterfall that flows year-round (We Dream of Travel). Spring is ideal for peak water flow and lush green moss, while autumn offers colorful foliage (Outside Mike).",
      photographyTips: "Explore multiple vantage points: from the trail to the left of the falls, from the right of the creek, or directly in the creek for a low perspective (Photographer\'s Trail Notes). The trail also passes behind the falls through a cavernous overhang, offering a unique \"behind the falls\" composition (The Stoke Fam). To handle spray, set up your composition, wipe the lens clean, use a 2-second timer, and remove the lens cap at the last second (We Dream of Travel). Use a long exposure to create soft, dreamlike water (YouTube). Additional notes: The trail is within a burn zone from the 2017 Eagle Creek fire; hikers should be cautious of fallen trees, debris, and steep drop-offs (Life Under Five Two). Slippery rocks and wet surfaces are common near the falls (Outside Mike). A fatality occurred in the area in 2016, serving as a reminder of the outdoor dangers (The Oregonian).",
      shotDirection: "North (The falls generally face North in the Columbia River Gorge) (Rod Barbee Photography).",
      lensesNeeded: "Wide-angle lenses ranging from 16mm to 35mm are recommended depending on the desired composition (Photographer\'s Trail Notes). Standard lenses can also work for isolating details (YouTube).",
      equipmentNeeded: "Tripod, waders or wet shoes for shooting from the creek, microfiber cloth to clean spray from the lens, and an umbrella or lens shield (Photographer\'s Trail Notes). ND filters are recommended for long exposure shots (We Dream of Travel).",
      permits: "Free parking is available at the Horsetail Falls trailhead along the Historic Columbia River Highway (The Gorge Guide). No specific permit is mentioned for the falls themselves.",
      directions: "From Portland: Take I-84 E to Exit 35 (Bridal Veil). Turn left onto the Historic Columbia River Highway and drive 1.5 miles to the parking area on the right. From Hood River: Take I-84 W to Exit 35 (Ainsworth State Park). Follow the Historic Columbia River Highway west for 1.6 miles to the parking area (We Dream of Travel). The trail starts at the base of Horsetail Falls (The Gorge Guide).",
      camping: "Ainsworth State Park is located nearby and offers camping options.",
      lodging: "Various lodging options are available in the nearby towns of Cascade Locks, Hood River, and Portland.",
      restaurants: "Dining options are available in Cascade Locks and Hood River.",
      cellService: "Cell service is generally limited within the deep basalt canyons of the Columbia River Gorge (Photographer\'s Trail Notes).",
      weather: "Accessible year-round except during extreme weather (We Dream of Travel). Spring and summer bring lush greenery, while winter can be wet and slippery (Outside Mike). Be mindful of wind-blown spray at the base of the falls (The Gorge Guide).",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/ponytail-falls",
      photos: []
    },
    {
      name: "Abiqua Falls",
      nearbyTown: "Scotts Mills, OR (closest); Silverton, OR; Salem, OR (33 miles west). Photographers Trail Notes",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "44.9261111",
      lng: "-122.5677778",
      elevation: "1,200 Ft. Photographers Trail Notes",
      trailDifficulty: "HARD (4 on a scale of 1-5). The last part of the trail is very slippery when wet. High clearance 4WD is needed to reach the trailhead, or an additional hike is required. Photographers Trail Notes",
      bestTimeOfDay: "The waterfall faces northwest and is nestled in a rocky bowl surrounded by tall, old-growth forest. The specific lighting conditions were noted as being influenced by this environment, suggesting soft light is preferable. Photographers Trail Notes",
      bestTimeOfYear: "Late summer to early fall is recommended as the water volume from late spring to early summer can be very high. It can also be photographed in mid-winter after a snowstorm, when the splash pool occasionally freezes. Photographers Trail Notes",
      photographyTips: "Visit on a weekday to avoid crowds. Consider various angles of the falls and be prepared for spray during wetter months (November to May). Photographers Trail Notes Additional notes: The guide mentions that the location has become more popular and recommends visiting on a weekday. It also warns that there are no services after Scotts Mills. The return route through Canby is noted as an easier option for those heading back to Portland. Photographers Trail Notes",
      shotDirection: "Around 90°. Photographers Trail Notes",
      lensesNeeded: "Wide-angle to short telephoto. 16mm is more than wide enough, and 24mm is also specifically mentioned. Photographers Trail Notes",
      equipmentNeeded: "Tripod, polarizer (to decrease water reflections), possibly a neutral density filter, and a high-clearance 4WD vehicle for the access road. Photographers Trail Notes",
      permits: "No permit required (as of March 2020). Photographers Trail Notes",
      directions: "From Silverton, take OR-213 N/Oak St for 3.2 miles, turn right on N Abiqua Rd. Once on the road down to the falls, go straight at two junctions. The road narrows to one lane. A high clearance 4WD vehicle is recommended for the final section; otherwise, park at the pullouts and walk. From the parking area, look for one of two dirt trails on the downhill side. Cross a dirt hump, bearing left downhill. Once at Abiqua Creek, hike upstream for about 1/4 mile to reach the falls. Photographers Trail Notes",
      camping: "Abiqua Creek Serenity campsite (15 miles away), Camp Dakota (3 miles north), and Silver Falls State Park (22 miles away). Photographers Trail Notes",
      lodging: "Silverton Inn and Suites and Oregon Garden Resort, both located in Silverton. Photographers Trail Notes",
      restaurants: "Silverton offers several options: Creekside Grill, Gather, and Mac’s Place. Photographers Trail Notes",
      cellService: "There is no cell service at this location. Photographers Trail Notes",
      weather: "The trail is noted as being VERY slippery on rainy days. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/abiqua-falls",
      photos: []
    },
    {
      name: "Seal Rock",
      nearbyTown: "Seal Rock, OR",
      state: "Oregon",
      region: "Pacific Northwest",
      lat: "",
      lng: "",
      elevation: "Sea level",
      trailDifficulty: "EASY - Rated 2 on a scale of 1-5. Easy walk from Seal Rock State Recreation parking lot down a cement ramp to the beach. May encounter some water or mud on the beach.",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "There are many ways to shoot the Seal Rocks. Most are pretty straightforward. Scouting recommended to find the composition that is best for you. The beach is a moderately popular location for tourists and photographers; unless you arrive early or stay late, you will have to share the location with many other people. The Oregon coastline can often be totally socked in from the marine layer (dense fog).",
      shotDirection: "",
      lensesNeeded: "16mm to 35mm lens depending on composition. Featured shot was taken with 24mm lens.",
      equipmentNeeded: "",
      permits: "",
      directions: "Accessible from Seal Rock State Recreation parking lot.",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/seal-rock",
      photos: []
    },
    {
      name: "Falls Creek Falls",
      nearbyTown: "Carson, WA",
      state: "Washington",
      region: "Pacific Northwest",
      lat: "",
      lng: "",
      elevation: "2,145 Ft.",
      trailDifficulty: "MODERATE TO DIFFICULT - Rated 3.5 on a scale of 1-5. Path to venture down to the creek is not very well defined, located about 30 yards from main viewing area.",
      bestTimeOfDay: "",
      bestTimeOfYear: "",
      photographyTips: "Two different places to shoot Falls Creek Falls: (1) Main viewing area at end of trailhead is fairly straightforward. (2) Venturing down to the creek provides a much better opportunity to produce spectacular shots. Falls are a series of 4 separate cascades adding up to over 200ft. A perspective control lens is recommended as you point up to capture the top of falls.",
      shotDirection: "",
      lensesNeeded: "Falls are tall and narrow, requiring different lenses depending on shooting location. Perspective control lens recommended for shooting upward.",
      equipmentNeeded: "",
      permits: "",
      directions: "",
      camping: "",
      lodging: "",
      restaurants: "",
      cellService: "",
      weather: "",
      sourceUrl: "https://photographerstrailnotes.com/oregon-washington/falls-creek-falls",
      photos: []
    },
    {
      name: "Brink Of The Lower Falls",
      nearbyTown: "Canyon Village (1.7 miles / 2.7 km north). West Yellowstone (approx. 40 miles / 1 hour west). Gardiner (approx. 40 miles / 1 hour north).",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "44.72017",
      lng: "-110.49583",
      elevation: "Approximately 7,700 ft at the trailhead, descending to about 7,400 ft at the brink overlook Justin Fague onX Maps. (Note: A placeholder value of 4,298 ft appears in some PTN preview snippets).",
      trailDifficulty: "MODERATE / STRENUOUS. Rated 3 out of 5 by Photographer's Trail Notes. The trail is 0.4 miles (0.64 km) each way with a significant elevation change of approximately 300-600 feet via 10 steep switchbacks Photographer's Trail Notes Noah Lang Photography. It is entirely paved but the ascent can be exhausting, especially at high altitude. Not recommended for those with health conditions NPS.",
      bestTimeOfDay: "Mid-day to afternoon is recommended for capturing rainbows in the mist, which typically form looking east Photographer's Trail Notes. Early morning (sunrise/blue hour) is also suggested for softer lighting and to avoid the extreme crowds that typically arrive by 9:00 AM Reddit Facebook.",
      bestTimeOfYear: "May through October when the trail is open 10Adventures. Late spring (May/June) offers the highest water volume (up to 60,000 gallons per second), while late fall (September/October) provides beautiful autumn colors and fewer crowds National Park Service Elaine J. Films. The trail is closed in winter due to ice and snow hazards.",
      photographyTips: "The location offers a unique perspective looking directly over the 308-foot drop. Mid-day is ideal for capturing rainbows that form in the mist looking east. You can also walk back up the switchbacks slightly to get abstract shots of the powerful water flow from above. The mist can be heavy at the bottom, so bring a lens cloth to keep your glass dry. The shot is fairly straightforward but requires careful composition to convey the sheer power of the Yellowstone River. Photographer's Trail Notes onX Maps The trail is noted as being strenuous and potentially dangerous due to steep drop-offs. The viewpoint is on a metal platform directly above the falls, which can cause vertigo. Visitors are warned not to underestimate the hike back up, as the 300-600ft ascent is concentrated in a short distance. \"Just be careful not to tumble in, as there is no return\" Photographer's Trail Notes. The trail is closed during the winter months. National Park Service",
      shotDirection: "East (looking down the canyon from the brink) Photographer's Trail Notes.",
      lensesNeeded: "Wide-angle lenses are most useful for capturing the scale of the falls and the canyon. A 20mm lens was used for the featured shot on Photographer's Trail Notes Photographer's Trail Notes. Lenses in the 16mm-35mm range are ideal, though telephotos can be used for abstracts of the water's flow.",
      equipmentNeeded: "A sturdy tripod is essential for long-exposure waterfall shots. Circular polarizer filters are recommended to reduce glare on the wet rocks and water. Trekking poles are highly suggested for the steep ascent and descent Bearfoot Theory. Comfortable hiking boots or sturdy walking shoes with good tread are necessary due to the steep, sometimes slippery paved path. Water and snacks are advised for the strenuous return hike. Travelffeine New England Waterfalls",
      permits: "A Yellowstone National Park entrance fee or pass (e.g., America the Beautiful Pass) is required to enter the park. No additional permits are needed for this specific trail or viewpoint. National Park Service",
      directions: "From Canyon Junction (intersection of Norris Canyon Road and Grand Loop Road), drive south on Grand Loop Road for approximately 1.2 miles. Turn left onto North Rim Drive, a one-way road. The Brink of the Lower Falls parking area is the first one you will encounter on the right Hikespeak Noah Lang Photography. The trail begins near the restrooms at the parking lot.",
      camping: "Canyon Campground is the nearest option, located in Canyon Village Bearfoot Theory. Other nearby options include Tower Fall Campground and Norris Campground NPS. Reservations are highly recommended well in advance.",
      lodging: "Canyon Lodge & Cabins is the closest lodging, located in Canyon Village Bearfoot Theory. Alternatives include Lake Yellowstone Hotel to the south or lodging in West Yellowstone (approx. 1 hour drive).",
      restaurants: "Canyon Village offers several options including the Canyon Lodge M66 Grill, Canyon Eatery (cafeteria style), and a general store with snacks and drinks Tripadvisor 10Adventures.",
      cellService: "Cell service is generally available but limited in the Canyon Village area Photographer's Trail Notes. Coverage can be spotty or non-existent at the bottom of the trail due to the canyon walls.",
      weather: "Yellowstone weather is highly variable. Mornings are often cool even in summer, with temperatures dropping below freezing at night. Afternoon thunderstorms are common. The trail is often wet and slippery due to mist from the falls. Elaine J. Films National Park Service",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/brink-of-the-lower-falls",
      photos: []
    },
    {
      name: "Fire In The Hole (Yellowstone National Park)",
      nearbyTown: "West Yellowstone, MT (approx. 25 miles); Jackson, WY (approx. 70 miles from the South Entrance).",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "44.536",
      lng: "-110.807",
      elevation: "6,653 ft",
      trailDifficulty: "EASY (Difficulty rating: 1 out of 5). It is described as a very easy walk from a nearby parking area, likely a boardwalk or paved path typical of Yellowstone's geyser basins.",
      bestTimeOfDay: "Just before sunset. The low sun angle illuminates the geyser’s mist, creating a \"fiery\" glow that gives the location its name. This lighting effect is most dramatic during the golden hour.",
      bestTimeOfYear: "Generally May through October when Firehole Lake Drive and other interior park roads are open to vehicles. Summer (June-August) offers the most reliable access, while late September can provide atmospheric conditions and fewer crowds.",
      photographyTips: "The key to the 'Fire In The Hole' shot is to underexpose the scene sufficiently to emphasize the fiery glow through the geyser's mist. Photographers should use a 5-shot bracket (1 f-stop apart) to capture the full dynamic range between the bright sunset and the foreground. For composition, include the full range of geyser mist to provide depth. Final images are often a blend of 3 images from the bracket. Use a tripod to ensure alignment for blending. The guide is part of the Photographer's Trail Notes membership area. While some information is restricted, the preview page and contextual details provide a substantial summary of the location. The term \"Fire In The Hole\" appears to be a specific artistic title given by Tim Wier to a shot of a geyser (likely on Firehole Lake Drive or a similar hydrothermal area) captured at sunset when the light creates a fiery effect in the mist. Bear spray is highly recommended for all photography in this region.",
      shotDirection: "Facing West (toward the setting sun).",
      lensesNeeded: "Wide angle (16mm-35mm) to capture the full stream and environment, or telephoto (70mm-200mm) to isolate the geyser's \"fire\" mist against the sunset.",
      equipmentNeeded: "Tripod (essential for bracketed exposures), camera with manual settings, remote shutter release, bear spray (highly recommended for safety in Yellowstone), and protective gear for camera equipment against geyser spray (silica/moisture).",
      permits: "Yellowstone National Park Entrance Fee (approx. $35/vehicle). No specific photography permit is required for personal use, but commercial filming/photography requires a permit.",
      directions: "Located within Yellowstone National Park. The location is accessed via Firehole Lake Drive, a one-way loop road off the main Grand Loop Road between Old Faithful and Madison Junction. Follow the one-way road to the geyser area (specifically looking for geysers that align with a western sunset, such as those in the Lower Geyser Basin).",
      camping: "Nearby options include Madison Campground (approx. 15-20 miles), Norris Campground, and several other National Park Service campgrounds within Yellowstone. Private camping is available in West Yellowstone. Yellowstone Camping",
      lodging: "Old Faithful Inn and Old Faithful Lodge (approx. 10-15 miles), Grant Village, or hotels in West Yellowstone, MT (approx. 20-30 miles). Yellowstone Lodging",
      restaurants: "Old Faithful area (cafeterias and dining rooms), Madison Junction (seasonal snacks), and numerous restaurants in West Yellowstone. Yellowstone Dining",
      cellService: "Spotty to non-existent in the geyser basins. Limited service may be available near Madison Junction or Old Faithful, but photographers should not rely on it at the specific shooting location.",
      weather: "Variable alpine climate. Temperatures can drop rapidly after sunset. Expect geothermal heat and steam near the geysers, with potentially slippery or wet conditions on boardwalks/paths. Summer highs in the 70s-80s°F, with nights often near freezing.",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/fire-in-the-hole",
      photos: []
    },
    {
      name: "Grand Canyon of the Yellowstone",
      nearbyTown: "Canyon Village (1 mile away); Jackson, WY (referenced for directions via South Entrance). Grand Canyon of the Yellowstone",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "44.7193889",
      lng: "-110.4815417",
      elevation: "7,606 ft Grand Canyon of the Yellowstone",
      trailDifficulty: "MODERATE. The trail to Artist Point is rated a 1/5 (easy 200yd walk). However, the trail to the specific vantage point mentioned is rated a 2/5 as it is short but somewhat dangerous and should not be taken lightly. Grand Canyon of the Yellowstone",
      bestTimeOfDay: "The Grand Canyon of The Yellowstone can be shot any time of day. However, just before sunrise is recommended before the sun blows out the scene. Shooting at sunrise or early morning also helps avoid the large crowds of tourists. Grand Canyon of the Yellowstone",
      bestTimeOfYear: "Spring, summer, or fall are great times to shoot. A specific example provided was taken on June 14th. Grand Canyon of the Yellowstone",
      photographyTips: "Artist Point on the south rim provides one of the best viewpoints and is a straightforward shot. It is a fairly small area and gets very crowded once tourists arrive. For a more unique perspective, the author suggests a spot just off the Artist Point parking lot (30 yds east of the restrooms, over the red fence and up a slope to a ledge trail). Panoramic shots can be created by stitching vertical frames. Early morning is key to avoiding crowds and harsh lighting. Grand Canyon of the Yellowstone Artist Point on the south rim is VERY busy during the day, with hundreds and hundreds of tourists. However, if you shoot at sunrise or early morning, you will see fewer other photographers there. The author mentions jumping over a red fence (about 30 yds east of the restrooms) and walking up a slope to a trail on the ledge of the canyon for a specific shot, noting this is a reason to shoot before sunrise. The hike to this specific location is described as somewhat dangerous and should not be taken lightly. Grand Canyon of the Yellowstone",
      shotDirection: "West @ 250°. Grand Canyon of the Yellowstone",
      lensesNeeded: "Lenses ranging from 24mm to 200mm depending on composition. Vertical panoramas can be made with a 24mm lens. Grand Canyon of the Yellowstone",
      equipmentNeeded: "Tripod, panoramic tools (if stitching), appropriate cold-weather clothing (hats, gloves) for pre-dawn shoots in the fall. Grand Canyon of the Yellowstone",
      permits: "Once the entrance fee for Yellowstone National Park is paid, no additional permits are required. Grand Canyon of the Yellowstone",
      directions: "The location is in central Yellowstone and can be accessed from all directions. From the Yellowstone South Entrance (coming from Jackson, WY): Travel north on US-191 for 21.2 miles toward West Thumb. Turn right (east) on US-20 and continue for 20.6 miles around the lake. Continue on Grand Loop Rd for another 13.1 miles. Near Canyon Village, turn right (east) on South Rim Dr and drive 1.6 miles to the visitor’s parking lot. Artist Point is at the end of the parking lot. Grand Canyon of the Yellowstone",
      camping: "Yellowstone Canyon Campground (located in Canyon Village, 1 mile away) – includes a nice shower and laundry facility with 250 campsites; it books up quickly in the summer. Grand Canyon of the Yellowstone",
      lodging: "Canyon Lodge (3 Canyon Loop Drive, N Rim Dr), Dunraven Lodge (North Rim Drive), and Lake Yellowstone Hotel and Cabins (on Lake Yellowstone). Grand Canyon of the Yellowstone",
      restaurants: "Canyon Village Area: Canyon Lodge Dining Room, Canyon Lodge Deli, and Canyon Lodge Cafeteria. These are described as standard national park food. Grand Canyon of the Yellowstone",
      cellService: "There is NO cell service at this location (tested with Verizon). There is limited cell service at Canyon Village. Grand Canyon of the Yellowstone",
      weather: "Mild in late spring, summer, and early fall; bitter in winter. Weather is unpredictable and changes quickly. Grand Canyon of the Yellowstone",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/grand-canyon-of-the-yellowstone",
      photos: []
    },
    {
      name: "Grand Prismatic Spring",
      nearbyTown: "The closest community is the Old Faithful area in Yellowstone National Park (approx. 4.5 miles away). Photographers Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "44.52358",
      lng: "-110.84018",
      elevation: "7,450 Ft. Photographers Trail Notes",
      trailDifficulty: "MODERATE (Rating: 2/5). The trail is a 3/4 mile easy walk from the parking lot with less than 200 feet of elevation change. The NPS has upgraded the path to a well-designed trail with stairs leading to a large viewing platform. Photographers Trail Notes",
      bestTimeOfDay: "Mid-morning through the afternoon. Direct sunshine on the spring is essential to reveal the vibrant colors; the shot does not work well on cloudy days. Warm days and sunny skies are necessary to minimize surface steam. It is recommended to arrive by 9:00 AM to secure parking and ensure the sun is high enough. Photographers Trail Notes",
      bestTimeOfYear: "Late June through October is the best time to photograph the spring. While roads are generally open from mid-April to November, the \"steam factor\" makes the warmer months much more favorable. Photographers Trail Notes",
      photographyTips: "Sunlight is Key: Vibrant colors are created by bacteria and require bright sunlight. Avoid cloudy days. Steam Management: If the air temperature is below 60°F, steam will likely cover the spring. Check for steam from the road before hiking. Composition: Use a normal lens (~50mm) for the full scene. Use medium to long telephotos to isolate bacterial mats for abstract compositions. Sky: Partly cloudy skies can add interest if the horizon and sky to the east are included. Crowd Management: Arrive by 9 AM. Be spatially aware on the viewing platform as it can get crowded with tripods. Filters: Use a polarizer to cut through surface reflections. Photographers Trail Notes Steam Warning: If the ambient temperature is below 60°F, steam from the hot spring will likely obscure the view. Check for steam before hiking. Environmental Protection: Stay on the designated trail and avoid cutting across the ridge to prevent erosion. Crowds: The viewing platform is popular; be mindful of other photographers and secure your tripod. Park Roads: Roads are generally open from June (mid-April for West Entrance) through early November. Check current road status before visiting. Map Data: A KMZ file is available for download on the page.",
      shotDirection: "Northeast (approximately 40°). Photographers Trail Notes",
      lensesNeeded: "",
      equipmentNeeded: "Camera & Lenses: Normal to long telephoto lenses. Filters: A polarizing filter is highly recommended to eliminate glare and enhance colors. Support: A tripod (be careful of jostling on the crowded platform). Vehicle: Necessary to reach the trailhead. Clothing: Layers for unpredictable and quickly changing weather. Photographers Trail Notes",
      permits: "Yellowstone National Park entrance fee is required. No additional photography permits are needed for this location. Photographers Trail Notes",
      directions: "From the Old Faithful area, travel north on US-287 for 4.5 miles to the Fairy Falls Trailhead parking lot. If full, use the large gravel overflow lot 0.1 miles southwest or park along the road (ensure wheels are completely off the asphalt). From the trailhead, walk 3/4 mile along Fountain Flat Drive (a flat, wide old road) and cross the bridge. As you approach the spring (on your right), take the small trail veering left up the ridgeline. Hike 200 yards up the stairs to the large viewing platform. Photographers Trail Notes",
      camping: "The closest option is the Madison Junction Campground, located 17 miles north. It is a well-regarded campground but fills up very quickly. Photographers Trail Notes",
      lodging: "Options in the Old Faithful area include the historic Old Faithful Inn (built 1904), the Old Faithful Lodge Cabins, and the Old Faithful Snow Lodge and Cabins (the newest option). Photographers Trail Notes",
      restaurants: "The Obsidian Dining Room in the Old Faithful Snow Lodge is recommended (noted for buffalo burgers and filets). There is also an adjacent bar with a fireplace. Most other options in the area are considered basic tourist food. Photographers Trail Notes",
      cellService: "There is NO cell service at the Grand Prismatic location (tested with Verizon). Limited cell service is available in the Old Faithful area. Photographers Trail Notes",
      weather: "Weather is unpredictable and changes quickly. Mild in late spring, summer, and early fall; bitter in winter. Temperatures below 60°F cause significant steam issues at the spring. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/grand-prismatic",
      photos: []
    },
    {
      name: "Lion's Roar",
      nearbyTown: "Old Faithful area in Yellowstone National Park, WY. Photographer's Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "44.463775",
      lng: "-110.8305639",
      elevation: "7,368ft Photographer's Trail Notes",
      trailDifficulty: "Moderate. Rated 2 on a scale of 1-5. It is an easy 1/2 mile walk to the Lion Geyser along a paved trail and boardwalk. Photographer's Trail Notes",
      bestTimeOfDay: "Late evening (around 8:00 PM). The example shot was taken at 8:12 PM. The guide suggests being prepared with your composition ahead of time as eruptions only last about 90 seconds. Photographer's Trail Notes",
      bestTimeOfYear: "Spring, summer, or fall. In the spring and fall, the sun sets to the left, which can provide a great glow in the steam. The example shot was taken on June 16th. Photographer's Trail Notes",
      photographyTips: "Position yourself on the boardwalk and line up Heart Spring with Lion Geyser. Get your tripod as low as possible and point downward to make Heart Spring appear larger. Be careful not to include the boardwalk in the frame. Eruptions last about 90 seconds (best pressure for 30-45 seconds), so have your composition and focus set ahead of time. Use the 'Geyser Times' website to track intervals. Take as many shots as possible as the water flow changes. Photographer's Trail Notes The guide mentions that the Lion Geyser Group consists of several geysers, and what makes the shot special is the bluish water pool (Heart Spring) that sits in front of it. It also warns about the unpredictability of the eruptions. There is a warning to preserve the area for future visitors. Cell service is mentioned as being limited or non-existent in many parts of the park, though it has improved near the Old Faithful area. Expect hundreds of tourists, but few photographers at this specific spot. KMZ file is available for download on the page. Photographer's Trail Notes",
      shotDirection: "Northwest @ 310°. Photographer's Trail Notes",
      lensesNeeded: "24mm (wide-angle) is recommended for the shot shown. Photographer's Trail Notes",
      equipmentNeeded: "Tripod, polarizer filter, tilt/shift lens (optional, to compensate for keystone effect), appropriate weather gear, food/water, music, headphones, a good book, and a folding chair for waiting. Photographer's Trail Notes",
      permits: "Yellowstone National Park entry fee required; no additional permits for this location. Photographer's Trail Notes",
      directions: "From the north side of the Old Faithful Lodge, walk toward the Old Faithful viewing area. At the viewing area, turn right and walk for about 100yds to a sign that says 'Upper Geyser Basin,' then take the path to the right. Stay on the path and walk over the bridge crossing the Firehole River. Once you cross the bridge, continue for another 100yds and the boardwalk will split. Stay left and walk along the geyser basin for about 1/4 mile. You are looking for a bluish pool of water right next to the boardwalk with a small sign that reads 'Heart Spring'. The location of the shot is on the boardwalk right where the 'Heart Spring' is. Photographer's Trail Notes",
      camping: "Not explicitly listed in a 'Camping' section, but the location is within Yellowstone National Park near Old Faithful. Photographer's Trail Notes",
      lodging: "Old Faithful Lodge and Old Faithful Snow Lodge are mentioned as the primary nearby options. Photographer's Trail Notes",
      restaurants: "Obsidian Dining Room in the Old Faithful Snow Lodge (recommended for the Bison Burger or Filet). Most other nearby options are described as 'tourist food'. Photographer's Trail Notes",
      cellService: "Improved in recent years, but many parts of the park have limited to no coverage. Photographer's Trail Notes",
      weather: "Mild in late spring, summer, and early fall; bitter in winter. Weather is unpredictable and changes quickly. Photographer's Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/lions-roar",
      photos: []
    },
    {
      name: "Mammoth Springs",
      nearbyTown: "Mammoth, WY (at the park border) and Gardiner, MT (7 miles north of Mammoth). Photographer's Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "44.9672111",
      lng: "-110.7066972",
      elevation: "6,567 Ft Photographer's Trail Notes",
      trailDifficulty: "Rated 1 on a scale of 1-5 (EASY). It is an easy 200-yard walk from the parking lot along a boardwalk. Photographer's Trail Notes",
      bestTimeOfDay: "The best time to photograph this location is at sunset or past sunset toward dusk, or on a cloudy day. This lighting helps eliminate harsh contrast between the foreground and the background. Photographer's Trail Notes",
      bestTimeOfYear: "Mammoth Springs can be photographed any time of year as long as the road is open. However, the road to the Upper Terraces is normally closed from December through April. Photographer's Trail Notes",
      photographyTips: "The composition focuses on water pools around dead trees. Because water flow is unpredictable and changes yearly, the pools may not always be full. When water is present, frame the shot from the boardwalk to align the dead trees with the background mountains and sunset. Always stay on the boardwalk to protect the fragile travertine. Photographer's Trail Notes The travertine hillside is very fragile; visitors must stay on the designated boardwalk at all times. Water flow in the springs is highly unpredictable and varies significantly from season to season and year to year. The specific composition with water in the pools near the dead trees is rare, occurring in only about 1 out of 5 visits for the author. Photographer's Trail Notes",
      shotDirection: "The shot direction is north by northeast at approximately 24°. Photographer's Trail Notes",
      lensesNeeded: "A 24mm lens was used for the featured shot. A tilt-shift lens is recommended for perspective control. Photographer's Trail Notes",
      equipmentNeeded: "A tripod is recommended. The use of a tilt-shift lens is also suggested to maintain correct perspective. Photographer's Trail Notes",
      permits: "Standard Yellowstone National Park entry fees apply; no additional permits are required for photography. Photographer's Trail Notes",
      directions: "The location is near Mammoth, WY, at the northern border of Yellowstone National Park. From Mammoth, drive 2.1 miles south on Highway 89 to the entrance of the Mammoth Springs Upper Terraces. Follow the one-way paved road for approximately 1/4 mile to the small parking area. From the parking lot, take the terrace path to the right and walk down about 200 yards to reach the shooting location. Photographer's Trail Notes",
      camping: "Mammoth Campground is located on the north side of Mammoth; it is a medium-sized, first-come, first-served campground that fills up quickly. There are also several RV parks in the town of Gardiner, Montana. Photographer's Trail Notes",
      lodging: "The Mammoth Hot Springs Hotel is located within a 10-minute walk of the springs. In nearby Gardiner, Montana, options include the Best Western By Mammoth Hot Springs and various other hotels. Photographer's Trail Notes",
      restaurants: "In Mammoth, dining is available at the Mammoth Hot Springs Hotel. In Gardiner, MT, there are numerous options, including the Yellowstone Grill (highly recommended for breakfast) and The Raven Grill. Photographer's Trail Notes",
      cellService: "Cell service is available at this location (confirmed with Verizon). Photographer's Trail Notes",
      weather: "Weather is mild in late spring, summer, and early fall, but can be bitter in winter. Conditions in Yellowstone are notoriously unpredictable and can change rapidly. Photographer's Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/mammoth-springs",
      photos: []
    },
    {
      name: "Mormon Barn (North)",
      nearbyTown: "Jackson, WY (approximately 12.9 miles south). Photographers Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "43.6664306",
      lng: "-110.6638889",
      elevation: "6,653ft Photographers Trail Notes",
      trailDifficulty: "EASY - Rated 1 on a scale of 1-5 (with 5 being most difficult). Photographers Trail Notes",
      bestTimeOfDay: "Sunrise. The sky illuminates several minutes before the mountain peaks, and the glow on the barn and foreground lasts only a few seconds. The photographer prefers sunrise for this location. Photographers Trail Notes",
      bestTimeOfYear: "Any time of year, but Spring (late May/early June) is preferred by the author. A sample shot was taken on July 21st. Photographers Trail Notes",
      photographyTips: "The shot is fairly straightforward but finding the right composition can be challenging. The primary focal points are the rustic old barn and the Grand Teton mountains. Be mindful of the roofline of the barn against the mountains; if you are too close, the roof sets too high against the peaks. The further back you move, the better the alignment. At sunrise, be prepared for the 'glow' on the barn and foreground which only lasts for a few seconds. Photographers Trail Notes The glow that illuminates the barn, shrubs, and foreground during sunrise only lasts for a few seconds, so photographers should be ready. Depending on the time of year, you can expect upward of 20-50 other photographers at sunrise. Photographers Trail Notes",
      shotDirection: "West by northwest @ 280°. Photographers Trail Notes",
      lensesNeeded: "24mm - 200mm, depending on the desired composition. Photographers Trail Notes",
      equipmentNeeded: "Tripod. No other special photography equipment is needed unless planning for specialized shots. Photographers Trail Notes",
      permits: "Grand Teton National Park entry fee/permit is required. No additional permits are needed once inside the park. Photographers Trail Notes",
      directions: "From Jackson, WY: Travel north on US-191 for 12.9 miles to Antelope Flats Rd. (which is unmarked). From Yellowstone: Travel south on US-191 toward Jackson; once you reach the Moran Entrance Station, continue toward the location. Photographers Trail Notes",
      camping: "Gros Ventre Campground (3.3 miles south), Jenny Lake Campground (11.3 miles west), and Crystal Creek Campground (15.3 miles east). Photographers Trail Notes",
      lodging: "Plenty of lodging options ranging from 1-star to 4-star hotels are available in the city of Jackson. Photographers Trail Notes",
      restaurants: "Cafe Genevieve, Liberty Burger, and Bin22, all located in Jackson, WY. Photographers Trail Notes",
      cellService: "Verizon service is fine in the Jackson and Jackson Hole area but may be limited outside these areas. Photographers Trail Notes",
      weather: "Wonderful in Spring, Summer, and Fall. Early mornings can be chilly. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/mormon-barn-north",
      photos: []
    },
    {
      name: "Oxbow Bend",
      nearbyTown: "Jackson, WY (about 35 miles south); Moran, WY. Photographers Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "43.8662778",
      lng: "-110.5492444",
      elevation: "6,749 Ft. Photographers Trail Notes",
      trailDifficulty: "EASY (Rating: 1 on a scale of 1-5). An easy 100yd walk from the parking lot. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise or sunset. Most shots are taken at sunrise. At sunset, the sun sets behind Mt. Moran and silhouettes the scene. Photographers Trail Notes",
      bestTimeOfYear: "Peak fall season is special for the golden aspens. It is rare to have snow on Mt. Moran in the fall. Other times of the year (spring, summer, and winter) can also provide great images. Photographers Trail Notes",
      photographyTips: "Can shoot from the road or walk down the slope to the water's edge. Scouting the location the day before is recommended if planning a sunrise shoot. Many compositions are possible, including panoramas. Photographers Trail Notes The icon view of the Snake River with Mt. Moran's reflection is the most recognized image of the area. It has been photographed thousands of times. During peak fall season, there can be 100+ photographers, and it's recommended to arrive 1-2 hours before sunrise to get a spot. Scouting the location the day before is suggested. If you arrive pre-dawn in the fall, it is likely to be bitter cold, so bring appropriate clothes. Photographers Trail Notes",
      shotDirection: "West at around 250°. Photographers Trail Notes",
      lensesNeeded: "Lenses ranging from 16mm - 35mm (wide angle), 24mm (used for panoramas), and 50mm to 100mm for other compositions. Photographers Trail Notes",
      equipmentNeeded: "Tripod, polarizer, warm clothing (parkas, hats, gloves) for pre-dawn fall shoots. Photographers Trail Notes",
      permits: "Located in Grand Teton National Park. Standard park entrance fee applies; no additional permits required for this location. Photographers Trail Notes",
      directions: "From Jackson, WY: Travel north on US-191 for 30.1 miles. Turn left on US-191 N/US-287 N/US-89 until reaching Moran Entrance Station (0.3 mile). Stay on US-191/US-287/US-89 for 2.6 miles. The Oxbow Bend visitor’s parking lot (holds about 15 cars) is on the left. Shots are often taken about 100yds north of the parking lot and down the slope to the water level. Photographers Trail Notes",
      camping: "Grand Teton - Colter Bay Campground, Signal Mountain Campground, Jenny Lake Campground. Photographers Trail Notes",
      lodging: "Jackson Lake Lodge (307) 543-2811, 101 Jackson Lake Lodge Rd, Moran, WY; Signal Mountain Lodge (307) 543-2831, 1 Inner Park Road, Moran, WY. Photographers Trail Notes",
      restaurants: "The Peaks Restaurant @ Signal Mountain Lodge (307) 543-2831; Trapper Grill @ Signal Mountain Lodge (307) 543-2831. Photographers Trail Notes",
      cellService: "Good cell service around the area (specifically mentioned for Verizon). Photographers Trail Notes",
      weather: "Wonderful in spring, summer, and fall. Early mornings before sunrise can be very cold. Winter can be extremely cold. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/oxbow-bend",
      photos: []
    },
    {
      name: "Schwabacher’s Landing",
      nearbyTown: "Jackson, WY (16 miles) Source",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "43.713425",
      lng: "-110.6717639",
      elevation: "6,558ft Source",
      trailDifficulty: "Rating: 1 on a scale of 1-5 (EASY). The hike to the three primary locations consists of an easy 1/4 mile walk on a well-maintained trail from the parking lot. Source",
      bestTimeOfDay: "Right at sunrise is considered the very best time, as the winds are typically still (ideal for reflections) and the sun hits the tips of the Tetons. Location #1 can also be shot after sunrise once the area is illuminated but before the light becomes too harsh. Location #3 is best until the sun 'blows out' the beaver pond. Source",
      bestTimeOfYear: "Late spring (early June) is recommended because the Tetons typically still have snow and the grass/pastures are green. Early spring often has brown grass. Summer is good, but snow on the peaks is significantly reduced or gone. Source",
      photographyTips: "Arrive before first light to secure a spot due to the location's popularity. The still winds at sunrise are critical for capturing the classic Teton reflections in the beaver ponds. Scouting the location the day before is recommended to navigate the path in the dark. For Location #2, consider vertical panoramic stitching (e.g., 4 vertical shots with a 24mm lens) to capture the full scale. Use a polarizer to manage reflections and glare. Source Schwabacher’s Landing is a very popular spot; photographers are advised to arrive before first light to secure a position for sunrise. The road to the landing is paved initially and then turns to gravel for the final 0.6 miles. The guide covers three specific shooting locations along the beaver pond trail. Location #2 is noted for being the site of the classic reflection shot, often captured using vertical panoramic stitching. Source",
      shotDirection: "West @ 275° Source",
      lensesNeeded: "Location #1: 24mm – 50mm. Location #2: 11mm – 35mm. Location #3: 11mm – 35mm. Source",
      equipmentNeeded: "Tripod (essential for long exposures or exposure blending), polarizer, and panoramic tools if planning stitched shots. Warm clothing, including hats and gloves, is recommended for pre-dawn arrivals, especially in the fall. Source",
      permits: "The location is within Grand Teton National Park. A standard park entrance fee/pass is required, but no additional special permits are needed for photography at this site. Source",
      directions: "From Jackson, WY, travel north on US-191 for 16 miles. Turn left onto Schwabacher’s Landing Rd and follow it for 0.6 miles (paved then gravel) to the parking lot at the end. From the parking lot: Location #1 is ~125 yards along the right path toward the Tetons; Location #2 is another 150 yards further along the pond's edge; Location #3 is another 125 yards around the trees to an opening with a bench. Source",
      camping: "Gros Ventre Campground (3.3 miles south), Jenny Lake Campground (11.3 miles west), and Crystal Creek Campground (15.3 miles east). Source",
      lodging: "Elk Country Inn (480 W Pearl Ave, Jackson, WY), Hampton Inn Jackson Hole (350 US-89, Jackson, WY). Numerous other 1-star to 4-star hotels are available in the city of Jackson. Source",
      restaurants: "Cafe Genevieve (135 E Broadway, Jackson) for breakfast and dinner, MacPhail's Burgers (known for Angus and Bison burgers), Liberty Burger (160 N Cache St, Jackson), and Bin22 (200 W Broadway, Jackson). Source",
      cellService: "Verizon service is reported as fine within Jackson and the Jackson Hole valley, but it can be very spotty outside of the valley area. Source",
      weather: "Wonderful in spring, summer, and fall. Early mornings can be very cold even in warmer seasons. Winters in the Jackson Hole area are extremely cold. Source",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/schwabachers-landing",
      photos: []
    },
    {
      name: "Snake River Overlook",
      nearbyTown: "Jackson, WY (approx. 25 minutes south); Moose, WY (approx. 9 miles south). NPS.gov",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "43.7535476",
      lng: "-110.6235424",
      elevation: "6,912 ft Photographer's Trail Notes",
      trailDifficulty: "EASY (Rating: 1 on a scale of 1-5). The hike to the classic overlook is an easy 40-yard walk from the paved parking lot. The viewing area is accessible and level. Photographer's Trail Notes",
      bestTimeOfDay: "Sunrise is the most recommended time to photograph the overlook. As the sun rises in the east (behind the photographer), it lights up the Teton peaks from the top down, often creating a 'glowing' effect. Afternoon and sunset can be hazier, but are excellent if there are dramatic clouds or storm systems. Explore Grand Teton",
      bestTimeOfYear: "The overlook is accessible year-round, which is rare for many park locations. May through October is the peak season with the best weather and longest days. Winter is also exceptional for capturing snow-blanketed valleys and mountains. Explore with Alec",
      photographyTips: "The shot is fairly straightforward from the designated viewing area. For a more unobstructed view, photographers sometimes stand on the rock wall or step just beyond the fence (staying on established paths). The key composition is the 'S' curve of the Snake River leading toward the Grand Teton mountains. Note that trees have grown significantly since Ansel Adams' time, partially obscuring the river. Photographer's Trail Notes The location is iconic due to Ansel Adams' 1942 photograph. However, a significant change since then is that the trees have grown much taller, partially blocking the lower left part of the 'S' curve in the Snake River. Despite this, it remains a premier photography spot in the park. Photographer's Trail Notes",
      shotDirection: "West (facing the Teton Range). Explore Grand Teton",
      lensesNeeded: "Focal lengths from 20mm to 50mm are recommended to capture the wide landscape of the river and the Teton range. Photographer's Trail Notes",
      equipmentNeeded: "A sturdy tripod is essential for sunrise and low-light shots. Graduated neutral density filters can help manage the high contrast between the sky and the shadowed valley. Warm layers of clothing are necessary for early mornings and winter visits. Bear spray is recommended when exploring any areas in the park. Photography Life",
      permits: "A Grand Teton National Park entrance fee or a valid Interagency Pass (e.g., America the Beautiful) is required to access the area. NPS.gov",
      directions: "The overlook is located directly off US Highway 191/26/89. From the town of Jackson, head north for about 25 minutes. It is located approximately 9 miles north of Moose Junction. The turn-off is clearly marked with a 'Snake River Overlook' sign. NPS.gov",
      camping: "Grand Teton National Park offers several nearby campgrounds, including Gros Ventre, Jenny Lake, Signal Mountain, Colter Bay, and Lizard Creek. NPS.gov",
      lodging: "Nearby lodging includes Jackson Lake Lodge, Signal Mountain Lodge, and various hotels and resorts in the town of Jackson. NPS.gov",
      restaurants: "The Mural Room and Pioneer Grill at Jackson Lake Lodge, and the Trapper Grill at Signal Mountain Lodge are the closest dining options within the park. NPS.gov",
      cellService: "Cell service is generally available at the overlook due to its proximity to the main highway (US-191). Photographer's Trail Notes",
      weather: "Mornings can be extremely cold even in summer. Winter temperatures often drop into the single digits. Sudden storms are common, and rainy days may completely obscure the Tetons from view. Explore with Alec",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/snake-river-overlook",
      photos: []
    },
    {
      name: "T.A. Moulton Barn (South)",
      nearbyTown: "Jackson, WY (approximately 15 miles south) Photographers Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "43.6606028",
      lng: "-110.6643444",
      elevation: "6,644 ft Photographers Trail Notes",
      trailDifficulty: "EASY (Rating: 1 on a scale of 1-5). The barn is only a few yards from a well-maintained parking area, making it very accessible. However, the dirt road can become impassable when muddy after hard rain, and access is restricted in winter. Photographers Trail Notes",
      bestTimeOfDay: "Approximately 15-30 minutes after sunrise. Key lighting stages include: 1) The Grand Tetons in the background glow red for a few minutes after sunrise. 2) The barn develops a wonderful glow once the sun reaches it. 3) The foreground becomes nicely illuminated several minutes after the sun hits the barn. Photographers Trail Notes",
      bestTimeOfYear: "Spring (late May to early June) is considered ideal because snow is likely still on the Teton peaks, the sunrise angle is favorable (crossing in front of the barn), and the range grass is vibrant green. However, quality images can be captured year-round, provided the road is open. Photographers Trail Notes",
      photographyTips: "The shot is straightforward, but the challenge lies in finding a unique composition. To avoid overlapping the barn with the Teton peaks, photographers often position themselves so the barn's tip sits between the mountains. Standing closer to the barn makes it appear higher relative to the background peaks. If the small stream in front contains water, it is highly recommended to include it as a foreground anchor for the shot. Photographers Trail Notes The T.A. Moulton Barn (South) is a historic structure located within Grand Teton National Park. A secondary 'north barn' is located approximately a quarter-mile up the road. Photographers should expect between 5 to 20 other people at sunrise during peak seasons (spring and fall). The road to the location is typically closed during the winter months. Arriving early or scouting the day before is recommended to secure a preferred composition. The dirt road (Mormon Row) can become very muddy and potentially impassable after heavy rain. Source Page",
      shotDirection: "West by Northwest @ 284° Photographers Trail Notes",
      lensesNeeded: "Focal lengths ranging from 11mm to 200mm can be used depending on composition. Most shots utilize lenses between 24mm and 135mm. Vertical panoramas (e.g., using a 24mm lens) are a common technique to capture the barn and peaks. Photographers Trail Notes",
      equipmentNeeded: "A tripod is essential. Panoramic tools are recommended for vertical or horizontal multi-shot compositions. Due to cold pre-dawn temperatures (especially in fall), appropriate clothing including hats and gloves is necessary. Photographers Trail Notes",
      permits: "The location is within Grand Teton National Park. Standard park entry fees apply, but no additional photography-specific permits are required once inside the park. Photographers Trail Notes",
      directions: "From Jackson, WY: Drive north on US-191 for 12.9 miles to Antelope Flats Rd (unmarked road just past mile marker 168). Turn right (east) and travel 1.6 miles to Mormon Row (dirt road). Turn right; the barn is 1/4 mile ahead on the right. From Yellowstone: Drive south on US-191. From the Moran Entrance Station, travel 4 miles and turn right (south) on US-191. Drive 20.8 miles and turn left (east) on Antelope Flats Rd. Travel 1.6 miles to Mormon Row, turn right, and drive 1/4 mile to the barn. Parking is available in a well-maintained area for 10-15 vehicles, with overflow on the dirt road. Photographers Trail Notes",
      camping: "Gros Ventre Campground (3.3 miles south); Jenny Lake Campground (11.3 miles west); Crystal Creek Campground (15.3 miles east). Photographers Trail Notes",
      lodging: "Elk Country Inn (307) 733-2364, 480 W Pearl Ave, Jackson; Hampton Inn Jackson Hole (307) 733-0033, 350 US-89, Jackson; Ranch Inn Motel (307) 733-6363, 45 E Pearl Ave, Jackson. Photographers Trail Notes",
      restaurants: "Cafe Genevieve (307) 732-1910, 135 E Broadway, Jackson; Liberty Burger (307) 200-6071, 160 N Cache St, Jackson; Bin22 (307) 739-9463, 200 W Broadway, Jackson. MacPhail's Burgers (specializing in Angus and Bison burgers) is also recommended. Photographers Trail Notes",
      cellService: "Verizon service is reported as good within the city of Jackson and the broader Jackson Hole area, but service becomes very spotty outside of the main valley. Photographers Trail Notes",
      weather: "Spring, summer, and fall weather is generally pleasant. Early mornings before sunrise are consistently cold regardless of the season. Winters in the Jackson Hole area are extremely cold and often involve road closures. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/ta-moulton-barn",
      photos: []
    },
    {
      name: "Teton Reflection",
      nearbyTown: "Jackson, WY (approximately 16 miles) Photographers Trail Notes",
      state: "Wyoming",
      region: "Rocky Mountains",
      lat: "43.7069611",
      lng: "-110.6764917",
      elevation: "6,567 ft Photographers Trail Notes",
      trailDifficulty: "1.5 on a scale of 1-5 (with 5 being most difficult). It’s an easy 1/4 mile walk from the parking area near just south of Schwabacher’s Landing on a well-defined trail. Photographers Trail Notes",
      bestTimeOfDay: "Sunrise to early morning before the sun gets too bright. The guide mentions being ready around sunrise to capture the pink glow on the tallest peaks. Photographers Trail Notes",
      bestTimeOfYear: "Whenever Grand Teton National Park is open. Early June is recommended for more snow on the Tetons, and late September is recommended for Fall colors. Photographers Trail Notes",
      photographyTips: "Arrive several minutes before sunrise to find your composition. A recommended composition is to frame the main mountain peak with the V-shape formed by the grass in the foreground. The photographer suggests waiting for the tallest peak to illuminate with a pink glow and then blending that shot with another taken a few minutes later when the foreground is in light. Photographers Trail Notes The location is reached before reaching the main Schwabacher’s Landing area. The shot involves a fairly straightforward composition but benefits from being at the site well before sunrise to capture the early light on the peaks. Photographers Trail Notes",
      shotDirection: "West @ 290° Photographers Trail Notes",
      lensesNeeded: "Wide-angle lens (to include foreground grass) or a zoom lens to capture the beaver pond and mountain peaks. Photographers Trail Notes",
      equipmentNeeded: "Sturdy tripod (for blending exposures) and a polarizer. Photographers Trail Notes",
      permits: "The location is in Grand Teton National Park. Once in the park, no additional permit is required. Photographers Trail Notes",
      directions: "From Jackson, WY, travel north on US-191 for approximately 16 miles and then turn left onto Schwabacher’s Landing Rd. Travel 3/4 mile until you see a small parking area on the left. This location is before the main Schwabacher’s Landing area. From the parking area, hike about 400 yards down a well-defined trail along the tributary leading west until you reach the location, which is about 100 yards past a beaver dam. Photographers Trail Notes",
      camping: "No specific campgrounds listed on the page, but the location is within Grand Teton National Park. Photographers Trail Notes",
      lodging: "No specific hotels listed on the page. The guide provides links to Visit Jackson Hole and Visit Jackson, WY for local information. Photographers Trail Notes",
      restaurants: "No specific restaurants listed on the page. The guide provides links to local tourism sites for more information. Photographers Trail Notes",
      cellService: "Spotty at the location, although cell service in the park overall has improved significantly in recent years. Photographers Trail Notes",
      weather: "Terrific in spring, summer, and fall. Early mornings before sunrise can be cold, and winters in the area can be freezing. Photographers Trail Notes",
      sourceUrl: "https://photographerstrailnotes.com/jackson-hole-yellowstone/teton-reflection",
      photos: []
    }

  ];

  // ---- Initialize ----
  function initLocations() {
    loadLocationsData();
    renderLocations();
    bindLocationEvents();
  }

  function loadLocationsData() {
    if (locations.length === 0) {
      locations = DEFAULT_LOCATIONS.map(l => ({ ...l, id: locIdCounter++ }));
    }
  }

  function bindLocationEvents() {
    const addBtn = document.getElementById("addLocationBtn");
    if (addBtn) addBtn.addEventListener("click", () => openLocationModal());

    const searchInput = document.getElementById("locationSearch");
    if (searchInput) searchInput.addEventListener("input", renderLocations);
  }

  // ---- Region Filters ----
  function getUsedRegions() {
    const regions = new Set(locations.map(l => l.region));
    return [...regions].sort();
  }

  function renderRegionFilters() {
    const container = document.getElementById("regionFilter");
    if (!container) return;
    const regions = getUsedRegions();
    container.innerHTML = `<button class="chip ${activeRegionFilter === 'all' ? 'active' : ''}" data-region="all">All Regions</button>` +
      regions.map(r => `<button class="chip ${activeRegionFilter === r ? 'active' : ''}" data-region="${r}">${r}</button>`).join("");

    container.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        activeRegionFilter = chip.dataset.region;
        renderLocations();
      });
    });
  }

  // ---- Filtered Locations ----
  function getFilteredLocations() {
    const search = (document.getElementById("locationSearch")?.value || "").toLowerCase();
    const activeRegion = activeRegionFilter;

    return locations.filter(l => {
      const matchSearch = !search ||
        l.name.toLowerCase().includes(search) ||
        l.region.toLowerCase().includes(search) ||
        (l.state && l.state.toLowerCase().includes(search)) ||
        (l.nearbyTown && l.nearbyTown.toLowerCase().includes(search)) ||
        (l.photographyTips && l.photographyTips.toLowerCase().includes(search)) ||
        (l.bestTimeOfYear && l.bestTimeOfYear.toLowerCase().includes(search));
      const matchRegion = activeRegion === "all" || l.region === activeRegion;
      return matchSearch && matchRegion;
    });
  }

  // ---- Trail Difficulty Helpers ----
  function parseDifficulty(str) {
    if (!str) return null;
    const m = str.match(/(\d+\.?\d*)\s*(?:\/\s*5|out of 5|\(|on a)/i);
    if (m) return parseFloat(m[1]);
    const m2 = str.match(/^(\d+\.?\d*)/);
    if (m2) return parseFloat(m2[1]);
    return null;
  }

  function difficultyColor(val) {
    if (val === null) return "";
    if (val <= 2) return "diff-easy";
    if (val <= 3) return "diff-moderate";
    return "diff-hard";
  }

  function difficultyLabel(val) {
    if (val === null) return "";
    if (val <= 2) return "Easy";
    if (val <= 3) return "Moderate";
    return "Hard";
  }

  // ---- Truncate helper ----
  function truncate(str, max) {
    if (!str) return "";
    if (str.length <= max) return str;
    return str.substring(0, max) + "\u2026";
  }

  // ---- Render ----
  function renderLocations() {
    renderRegionFilters();
    const filtered = getFilteredLocations();
    const container = document.getElementById("locationsGrid");
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <i data-lucide="map-pin-off"></i>
        <p>No locations found. Add your first scouting location above.</p>
      </div>`;
      lucide.createIcons();
      return;
    }

    // Group by region
    const grouped = {};
    for (const loc of filtered) {
      if (!grouped[loc.region]) grouped[loc.region] = [];
      grouped[loc.region].push(loc);
    }

    let html = "";
    const regionOrder = Object.keys(grouped).sort();

    for (const region of regionOrder) {
      html += `<div class="loc-region-group">
        <div class="loc-region-label">
          <i data-lucide="map"></i>
          <span>${escapeHtml(region)}</span>
          <span class="loc-region-count">${grouped[region].length}</span>
        </div>
        <div class="loc-cards">`;

      for (const loc of grouped[region]) {
        const isExpanded = expandedLocationId === loc.id;
        const hasCoords = loc.lat && loc.lng;
        const coordsDisplay = hasCoords ? `${parseFloat(loc.lat).toFixed(4)}\u00b0, ${parseFloat(loc.lng).toFixed(4)}\u00b0` : "";
        const diffVal = parseDifficulty(loc.trailDifficulty);
        const diffClass = difficultyColor(diffVal);
        const diffText = diffVal !== null ? `${diffVal}/5` : "";

        html += `<div class="loc-card ${isExpanded ? 'loc-card--expanded' : ''}" data-loc-id="${loc.id}">
          <div class="loc-card-main" data-expand-loc="${loc.id}">
            <div class="loc-card-info">
              <div class="loc-card-name">${escapeHtml(loc.name)}</div>
              <div class="loc-card-meta">
                ${loc.state ? `<span class="loc-meta-tag"><i data-lucide="map-pin"></i>${escapeHtml(loc.state)}</span>` : ""}
                ${loc.bestTimeOfYear ? `<span class="loc-meta-tag"><i data-lucide="calendar"></i>${escapeHtml(truncate(loc.bestTimeOfYear, 40))}</span>` : ""}
                ${diffText ? `<span class="loc-meta-tag loc-diff-tag ${diffClass}"><i data-lucide="footprints"></i>${diffText}</span>` : ""}
                ${hasCoords ? `<span class="loc-meta-tag loc-meta-coords"><i data-lucide="navigation"></i>${coordsDisplay}</span>` : ""}
              </div>
            </div>
            <div class="loc-card-actions">
              <button class="btn-ghost" onclick="event.stopPropagation(); window._locModule.openLocationModal(${loc.id})" title="Edit"><i data-lucide="pencil"></i></button>
              <button class="btn-danger" onclick="event.stopPropagation(); window._locModule.deleteLocation(${loc.id})" title="Delete"><i data-lucide="trash-2"></i></button>
              <div class="loc-expand-icon"><i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}"></i></div>
            </div>
          </div>`;

        // Expanded detail
        if (isExpanded) {
          html += `<div class="loc-card-detail">`;

          // ---- Photography Section ----
          const photoFields = [
            { key: "bestTimeOfDay", icon: "sun", label: "Best Time of Day" },
            { key: "bestTimeOfYear", icon: "calendar", label: "Best Time of Year" },
            { key: "shotDirection", icon: "compass", label: "Shot Direction" },
            { key: "lensesNeeded", icon: "aperture", label: "Lenses Needed" },
            { key: "equipmentNeeded", icon: "backpack", label: "Equipment Needed" },
            { key: "photographyTips", icon: "camera", label: "Photography Tips" }
          ];
          const hasPhotoData = photoFields.some(f => loc[f.key]);
          if (hasPhotoData) {
            html += `<div class="loc-detail-section">
              <div class="loc-detail-section-header"><i data-lucide="camera"></i> Photography</div>
              <div class="loc-detail-grid">`;
            for (const f of photoFields) {
              if (loc[f.key]) {
                html += `<div class="loc-detail-item">
                  <span class="loc-detail-label"><i data-lucide="${f.icon}"></i> ${f.label}</span>
                  <span class="loc-detail-value">${escapeHtml(loc[f.key])}</span>
                </div>`;
              }
            }
            html += `</div></div>`;
          }

          // ---- Logistics Section ----
          const logFields = [
            { key: "trailDifficulty", icon: "footprints", label: "Trail Difficulty" },
            { key: "permits", icon: "clipboard-check", label: "Permits" },
            { key: "directions", icon: "navigation", label: "Directions" },
            { key: "cellService", icon: "signal", label: "Cell Service" }
          ];
          const hasLogData = logFields.some(f => loc[f.key]);
          if (hasLogData) {
            html += `<div class="loc-detail-section">
              <div class="loc-detail-section-header"><i data-lucide="footprints"></i> Logistics</div>
              <div class="loc-detail-grid">`;
            for (const f of logFields) {
              if (loc[f.key]) {
                html += `<div class="loc-detail-item">
                  <span class="loc-detail-label"><i data-lucide="${f.icon}"></i> ${f.label}</span>
                  <span class="loc-detail-value">${escapeHtml(loc[f.key])}</span>
                </div>`;
              }
            }
            html += `</div></div>`;
          }

          // ---- Nearby Section ----
          const nearbyFields = [
            { key: "camping", icon: "tent", label: "Camping" },
            { key: "lodging", icon: "bed", label: "Lodging" },
            { key: "restaurants", icon: "utensils", label: "Restaurants" }
          ];
          const hasNearbyData = nearbyFields.some(f => loc[f.key]);
          if (hasNearbyData) {
            html += `<div class="loc-detail-section">
              <div class="loc-detail-section-header"><i data-lucide="tent"></i> Nearby</div>
              <div class="loc-detail-grid">`;
            for (const f of nearbyFields) {
              if (loc[f.key]) {
                html += `<div class="loc-detail-item">
                  <span class="loc-detail-label"><i data-lucide="${f.icon}"></i> ${f.label}</span>
                  <span class="loc-detail-value">${escapeHtml(loc[f.key])}</span>
                </div>`;
              }
            }
            html += `</div></div>`;
          }

          // ---- Weather Section ----
          if (loc.weather) {
            html += `<div class="loc-detail-section">
              <div class="loc-detail-section-header"><i data-lucide="cloud-sun"></i> Weather & Climate</div>
              <div class="loc-detail-grid">
                <div class="loc-detail-item">
                  <span class="loc-detail-label"><i data-lucide="cloud-sun"></i> Weather</span>
                  <span class="loc-detail-value">${escapeHtml(loc.weather)}</span>
                </div>
              </div>
            </div>`;
          }

          // ---- Additional Info (Elevation & Nearby Town) ----
          if (loc.elevation || loc.nearbyTown) {
            html += `<div class="loc-detail-section">
              <div class="loc-detail-section-header"><i data-lucide="info"></i> Additional Info</div>
              <div class="loc-detail-grid">`;
            if (loc.elevation) {
              html += `<div class="loc-detail-item">
                <span class="loc-detail-label"><i data-lucide="mountain"></i> Elevation</span>
                <span class="loc-detail-value">${escapeHtml(loc.elevation)}</span>
              </div>`;
            }
            if (loc.nearbyTown) {
              html += `<div class="loc-detail-item">
                <span class="loc-detail-label"><i data-lucide="building-2"></i> Nearby Town</span>
                <span class="loc-detail-value">${escapeHtml(loc.nearbyTown)}</span>
              </div>`;
            }
            html += `</div></div>`;
          }

          // GPS link
          if (hasCoords) {
            html += `<div class="loc-detail-section">
              <a href="https://www.google.com/maps?q=${loc.lat},${loc.lng}" target="_blank" rel="noopener noreferrer" class="loc-map-link">
                <i data-lucide="external-link"></i>
                <span>Open in Google Maps</span>
              </a>
            </div>`;
          }

          // Source link
          if (loc.sourceUrl) {
            html += `<div class="loc-detail-section">
              <a href="${escapeHtml(loc.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="loc-map-link">
                <i data-lucide="book-open"></i>
                <span>View on Photographer's Trail Notes</span>
              </a>
            </div>`;
          }

          // Photo Gallery
          if (loc.photos && loc.photos.length > 0) {
            html += `<div class="loc-detail-section">
              <span class="loc-detail-label"><i data-lucide="image"></i> Reference Photos</span>
              <div class="loc-photo-gallery">`;
            for (let i = 0; i < loc.photos.length; i++) {
              html += `<div class="loc-photo-thumb">
                <img src="${escapeHtml(loc.photos[i])}" alt="Reference photo" loading="lazy">
                <button class="loc-photo-remove" onclick="event.stopPropagation(); window._locModule.removePhoto(${loc.id}, ${i})" title="Remove photo"><i data-lucide="x"></i></button>
              </div>`;
            }
            html += `</div>`;
          }
          // Add photo button
          html += `<div class="loc-add-photo-row">
            <button class="btn btn-sm" onclick="event.stopPropagation(); window._locModule.addPhotoPrompt(${loc.id})">
              <i data-lucide="image-plus"></i>
              <span>Add Photo URL</span>
            </button>
          </div>`;

          html += `</div>`; // close loc-card-detail
        }

        html += `</div>`; // close loc-card
      }

      html += `</div></div>`; // close loc-cards, loc-region-group
    }

    container.innerHTML = html;

    // Bind expand/collapse
    container.querySelectorAll("[data-expand-loc]").forEach(el => {
      el.addEventListener("click", () => {
        const id = parseInt(el.dataset.expandLoc);
        expandedLocationId = expandedLocationId === id ? null : id;
        renderLocations();
        lucide.createIcons();
      });
    });

    lucide.createIcons();
  }

  // ---- Add / Edit Modal ----
  function openLocationModal(id) {
    const item = id ? locations.find(l => l.id === id) : null;
    document.getElementById("modalTitle").textContent = item ? "Edit Location" : "Add Location";
    document.getElementById("modal").classList.add("modal-wide");

    const regionOptions = [...new Set([...REGIONS, ...getUsedRegions()])].sort();

    const diffOptions = [1, 2, 3, 4, 5];
    const currentDiff = item ? parseDifficulty(item.trailDifficulty) : null;

    document.getElementById("modalBody").innerHTML = `
      <!-- Basic Info -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="info"></i> Basic Info</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-field">
            <label for="locName">Location Name</label>
            <input type="text" id="locName" value="${item ? escapeHtml(item.name) : ""}" placeholder="e.g. Mesa Arch">
          </div>
          <div class="form-row-2">
            <div class="form-field">
              <label for="locRegion">Region</label>
              <select id="locRegion">
                ${regionOptions.map(r => `<option value="${r}" ${item && item.region === r ? "selected" : ""}>${r}</option>`).join("")}
              </select>
            </div>
            <div class="form-field">
              <label for="locState">State / Country</label>
              <input type="text" id="locState" value="${item ? escapeHtml(item.state || "") : ""}" placeholder="e.g. Utah">
            </div>
          </div>
          <div class="form-field">
            <label for="locNearbyTown">Nearby Town</label>
            <input type="text" id="locNearbyTown" value="${item ? escapeHtml(item.nearbyTown || "") : ""}" placeholder="e.g. Moab">
          </div>
        </div>
      </div>

      <!-- Coordinates -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="map-pin"></i> Coordinates</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-row-2">
            <div class="form-field">
              <label for="locLat">Latitude</label>
              <input type="text" id="locLat" value="${item ? escapeHtml(item.lat || "") : ""}" placeholder="e.g. 38.3870">
            </div>
            <div class="form-field">
              <label for="locLng">Longitude</label>
              <input type="text" id="locLng" value="${item ? escapeHtml(item.lng || "") : ""}" placeholder="e.g. -109.5925">
            </div>
          </div>
          <div class="form-field">
            <label for="locElevation">Elevation</label>
            <input type="text" id="locElevation" value="${item ? escapeHtml(item.elevation || "") : ""}" placeholder="e.g. 5,039 ft">
          </div>
        </div>
      </div>

      <!-- Photography -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="camera"></i> Photography</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-row-2">
            <div class="form-field">
              <label for="locBestTimeOfDay">Best Time of Day</label>
              <input type="text" id="locBestTimeOfDay" value="${item ? escapeHtml(item.bestTimeOfDay || "") : ""}" placeholder="e.g. Sunrise, golden hour">
            </div>
            <div class="form-field">
              <label for="locBestTimeOfYear">Best Time of Year</label>
              <input type="text" id="locBestTimeOfYear" value="${item ? escapeHtml(item.bestTimeOfYear || "") : ""}" placeholder="e.g. Spring / Fall">
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-field">
              <label for="locShotDirection">Shot Direction</label>
              <input type="text" id="locShotDirection" value="${item ? escapeHtml(item.shotDirection || "") : ""}" placeholder="e.g. East @ 110\u00b0">
            </div>
            <div class="form-field">
              <label for="locLensesNeeded">Lenses Needed</label>
              <input type="text" id="locLensesNeeded" value="${item ? escapeHtml(item.lensesNeeded || "") : ""}" placeholder="e.g. 16-35mm wide-angle">
            </div>
          </div>
          <div class="form-field">
            <label for="locEquipmentNeeded">Equipment Needed</label>
            <input type="text" id="locEquipmentNeeded" value="${item ? escapeHtml(item.equipmentNeeded || "") : ""}" placeholder="e.g. Tripod, polarizer, ND filters">
          </div>
          <div class="form-field">
            <label for="locPhotographyTips">Photography Tips</label>
            <textarea id="locPhotographyTips" placeholder="Detailed photography tips and compositions...">${item ? escapeHtml(item.photographyTips || "") : ""}</textarea>
          </div>
        </div>
      </div>

      <!-- Logistics -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="footprints"></i> Logistics</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-row-2">
            <div class="form-field">
              <label for="locTrailDifficulty">Trail Difficulty (1\u20135)</label>
              <select id="locTrailDifficulty">
                <option value="">\u2014 Select \u2014</option>
                ${diffOptions.map(d => `<option value="${d}" ${currentDiff !== null && Math.round(currentDiff) === d ? "selected" : ""}>${d} \u2014 ${d <= 2 ? "Easy" : d <= 3 ? "Moderate" : "Hard"}</option>`).join("")}
              </select>
            </div>
            <div class="form-field">
              <label for="locCellService">Cell Service</label>
              <input type="text" id="locCellService" value="${item ? escapeHtml(item.cellService || "") : ""}" placeholder="e.g. Spotty, Verizon only">
            </div>
          </div>
          <div class="form-field">
            <label for="locPermits">Permits</label>
            <input type="text" id="locPermits" value="${item ? escapeHtml(item.permits || "") : ""}" placeholder="e.g. Park entrance fee required">
          </div>
          <div class="form-field">
            <label for="locDirections">Directions</label>
            <textarea id="locDirections" placeholder="Driving and hiking directions...">${item ? escapeHtml(item.directions || "") : ""}</textarea>
          </div>
        </div>
      </div>

      <!-- Nearby -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="tent"></i> Nearby</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-field">
            <label for="locCamping">Camping</label>
            <textarea id="locCamping" placeholder="Nearby campgrounds...">${item ? escapeHtml(item.camping || "") : ""}</textarea>
          </div>
          <div class="form-field">
            <label for="locLodging">Lodging</label>
            <textarea id="locLodging" placeholder="Hotels, inns, lodges...">${item ? escapeHtml(item.lodging || "") : ""}</textarea>
          </div>
          <div class="form-field">
            <label for="locRestaurants">Restaurants</label>
            <textarea id="locRestaurants" placeholder="Dining options...">${item ? escapeHtml(item.restaurants || "") : ""}</textarea>
          </div>
        </div>
      </div>

      <!-- Weather -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="cloud-sun"></i> Weather / Climate</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-field">
            <label for="locWeather">Weather</label>
            <textarea id="locWeather" placeholder="Climate, temperature, seasonal conditions...">${item ? escapeHtml(item.weather || "") : ""}</textarea>
          </div>
        </div>
      </div>

      <!-- Source -->
      <div class="loc-modal-section">
        <div class="loc-modal-section-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span><i data-lucide="link"></i> Source</span>
          <i data-lucide="chevron-down" class="loc-section-toggle"></i>
        </div>
        <div class="loc-modal-section-body">
          <div class="form-field">
            <label for="locSourceUrl">Source URL</label>
            <input type="text" id="locSourceUrl" value="${item ? escapeHtml(item.sourceUrl || "") : ""}" placeholder="https://photographerstrailnotes.com/...">
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window._locModule.saveLocation(${id || 'null'})">${item ? "Save Changes" : "Add Location"}</button>
      </div>
    `;
    openModal();
    lucide.createIcons();
    setTimeout(() => document.getElementById("locName").focus(), 100);
  }

  function saveLocation(id) {
    const name = document.getElementById("locName").value.trim();
    const region = document.getElementById("locRegion").value;
    const state = document.getElementById("locState").value.trim();
    const nearbyTown = document.getElementById("locNearbyTown").value.trim();
    const lat = document.getElementById("locLat").value.trim();
    const lng = document.getElementById("locLng").value.trim();
    const elevation = document.getElementById("locElevation").value.trim();
    const bestTimeOfDay = document.getElementById("locBestTimeOfDay").value.trim();
    const bestTimeOfYear = document.getElementById("locBestTimeOfYear").value.trim();
    const shotDirection = document.getElementById("locShotDirection").value.trim();
    const lensesNeeded = document.getElementById("locLensesNeeded").value.trim();
    const equipmentNeeded = document.getElementById("locEquipmentNeeded").value.trim();
    const photographyTips = document.getElementById("locPhotographyTips").value.trim();
    const trailDiffSelect = document.getElementById("locTrailDifficulty").value;
    const trailDifficulty = trailDiffSelect ? trailDiffSelect + "/5" : "";
    const permits = document.getElementById("locPermits").value.trim();
    const directions = document.getElementById("locDirections").value.trim();
    const cellService = document.getElementById("locCellService").value.trim();
    const camping = document.getElementById("locCamping").value.trim();
    const lodging = document.getElementById("locLodging").value.trim();
    const restaurants = document.getElementById("locRestaurants").value.trim();
    const weather = document.getElementById("locWeather").value.trim();
    const sourceUrl = document.getElementById("locSourceUrl").value.trim();

    if (!name) { showToast("Please enter a location name", "error"); return; }

    const data = {
      name, region, state, nearbyTown, lat, lng, elevation,
      bestTimeOfDay, bestTimeOfYear, shotDirection, lensesNeeded, equipmentNeeded,
      photographyTips, trailDifficulty, permits, directions, cellService,
      camping, lodging, restaurants, weather, sourceUrl
    };

    if (id) {
      const item = locations.find(l => l.id === id);
      if (item) {
        Object.assign(item, data);
      }
      showToast("Location updated", "success");
    } else {
      locations.push({ id: locIdCounter++, ...data, photos: [] });
      showToast("Location added", "success");
    }

    if (typeof saveData === "function") saveData();
    closeModal();
    renderLocations();
    lucide.createIcons();
  }

  function deleteLocation(id) {
    locations = locations.filter(l => l.id !== id);
    if (expandedLocationId === id) expandedLocationId = null;
    if (typeof saveData === "function") saveData();
    renderLocations();
    lucide.createIcons();
    showToast("Location removed", "success");
  }

  // ---- Photo Gallery ----
  function addPhotoPrompt(locId) {
    const url = prompt("Enter image URL:");
    if (!url || !url.trim()) return;
    const loc = locations.find(l => l.id === locId);
    if (!loc) return;
    if (!loc.photos) loc.photos = [];
    loc.photos.push(url.trim());
    if (typeof saveData === "function") saveData();
    renderLocations();
    lucide.createIcons();
    showToast("Photo added", "success");
  }

  function removePhoto(locId, index) {
    const loc = locations.find(l => l.id === locId);
    if (!loc || !loc.photos) return;
    loc.photos.splice(index, 1);
    if (typeof saveData === "function") saveData();
    renderLocations();
    lucide.createIcons();
    showToast("Photo removed", "success");
  }

  // ---- Escape helper (reuse from main app if available) ----
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Expose for global access (used by inline onclick handlers and app.js init)
  window.initLocations = initLocations;
  window._locModule = {
    openLocationModal,
    saveLocation,
    deleteLocation,
    addPhotoPrompt,
    removePhoto
  };
})();
