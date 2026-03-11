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
