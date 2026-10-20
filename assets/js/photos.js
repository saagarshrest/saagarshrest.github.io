/* =====================================================================
   Photos: Unsplash-style gallery with an expanding viewer.
   Photos are loaded straight from Unsplash by URL (nothing is stored in
   this repo). The list below holds all of the profile's photos.
   To add one, add a line to PHOTOS:
     { p: 'photo path from the image URL', slug: 'unsplash page id',
       r: width / height, alt: 'description' }
   ===================================================================== */
(function () {
    'use strict';
    var PROFILE = 'https://unsplash.com/@saagarshrest';
    var BY = 'Photo by Saagar Shrestha';
    var UNTITLED = 'Photograph by Saagar Shrestha, Nepal';
    var BATCH = 40;

    var PHOTOS = [
        { p: "photo-1778518730820-1f9ab5a6a5ce", slug: "fQCmT6vcux0", r: 0.5627, alt: "" },
        { p: "photo-1778518730744-ed4168a9c305", slug: "glC2EWFQSkQ", r: 1.7773, alt: "Snow-covered mountain peak against a clear blue sky" },
        { p: "photo-1778518731140-a0716a3796db", slug: "nvS-_jjW0jk", r: 0.5627, alt: "Snow-capped mountain range with a crescent moon above" },
        { p: "photo-1778518730972-17422d9e5450", slug: "5V6xAo8UL90", r: 0.5626, alt: "Rock cairn by a calm lake reflecting snowy peaks" },
        { p: "photo-1778518732492-403ea005dc7c", slug: "Ialc9W7cXJU", r: 0.5627, alt: "Motorcycle parked near rustic buildings in a dense pine forest" },
        { p: "photo-1778518732703-afa4a4136d7c", slug: "Ay2oMEqf8QM", r: 1.7773, alt: "Snow-capped mountains under a blue sky with wispy clouds" },
        { p: "photo-1778518732260-4423087a7b6a", slug: "nr2Xp_9vZoo", r: 0.5627, alt: "" },
        { p: "photo-1778518730857-94bb42b75eef", slug: "TDuvP0M2Pqo", r: 0.5627, alt: "Snow-covered mountain peak with clouds swirling around" },
        { p: "photo-1778518731943-62f0c55901f9", slug: "6tTUbZ5za_o", r: 0.5627, alt: "Majestic snow-covered mountain rises above dark evergreen trees" },
        { p: "photo-1778518731742-d7d5c72b9a9a", slug: "U-TGowtUAjs", r: 0.5627, alt: "Snow-capped mountain peak with blurred foreground plants" },
        { p: "photo-1778518732364-e747eea6365a", slug: "aYvsvROLHVA", r: 0.5627, alt: "A towering snow-covered mountain peak against a pale sky" },
        { p: "photo-1778518732232-70a0e894c2d2", slug: "hi5gga2wO2o", r: 0.5627, alt: "Half moon rising above a dark, snowy hill" },
        { p: "photo-1778518732222-d6a8101301f0", slug: "XXHR1CsM8M4", r: 1.7773, alt: "Snow-capped mountains under a cloudy sky" },
        { p: "photo-1778518731184-f4a8d90eb5ad", slug: "AZVtk6isvIk", r: 1.7773, alt: "Beautiful mountain lake nestled between forested peaks and snow-capped mountains" },
        { p: "photo-1778518732317-0ac52f51f8ef", slug: "-IGjhUujNOw", r: 0.5627, alt: "Snow-capped mountain and forested hills reflected in calm blue water" },
        { p: "photo-1778518732532-1eb38a56ce34", slug: "3SRQgXWip_s", r: 1.7773, alt: "Snow-capped mountain behind rocky hills and trees" },
        { p: "photo-1778518731196-a1db421f1965", slug: "GVOkirEbvlI", r: 1.7773, alt: "" },
        { p: "photo-1778518730618-f7ae1300cbed", slug: "aJxpEvg3sUU", r: 0.5627, alt: "A person walks on a smoky path with prayer flags" },
        { p: "photo-1778518731036-c9f7b72fa1b4", slug: "BOcNnXe4GzU", r: 1.7773, alt: "A winding road leads to snow-capped mountains and pine trees" },
        { p: "photo-1778518732034-de6364c50c7d", slug: "RKWdqsf1Y0M", r: 0.5627, alt: "" },
        { p: "photo-1778518730837-721ea8b0b514", slug: "_enjGsHu4cs", r: 0.5627, alt: "Snow-capped mountains overlook a rushing river and suspension bridge" },
        { p: "photo-1778518731725-bd69ed6ea017", slug: "BXZeiSKkRHw", r: 1.7773, alt: "Snow-capped mountains under a clear blue sky" },
        { p: "photo-1778518731865-2a7d2c4a1bc7", slug: "d92QB2tiAMs", r: 1.7773, alt: "Majestic mountains and a wide valley under a blue sky" },
        { p: "photo-1778518730787-b589bfdf7c72", slug: "2LjW63WA21c", r: 0.5627, alt: "" },
        { p: "photo-1778518732454-585af4904ddb", slug: "EjwwYxRCImI", r: 1.7773, alt: "Snow-capped mountains rise above a tranquil lake and forest" },
        { p: "photo-1778518731998-15b3752c01bc", slug: "U7-1R7o679g", r: 0.5627, alt: "A waterfall cascades down a rocky mountainside with trees" },
        { p: "photo-1778518731744-8936825cb13a", slug: "olyvcUbYHl0", r: 0.5627, alt: "Snow-capped mountain peak above dark hills and prayer flags" },
        { p: "photo-1778518732128-4dcf080659f0", slug: "N9EKvdmNayk", r: 0.5627, alt: "" },
        { p: "photo-1778518732632-a260352408e5", slug: "6rewxxfsm0Y", r: 1.7241, alt: "Starry night sky over snow-capped mountains and a valley" },
        { p: "photo-1778518732405-0b4e67fe5342", slug: "gtUm595U2a0", r: 0.5627, alt: "Majestic snow-capped mountain overlooking a serene lake and green hills" },
        { p: "photo-1778518730585-cc07e9eec3dd", slug: "XXKjlj-myUo", r: 1.7773, alt: "Snow-capped mountains under a clear sky with dark foreground" },
        { p: "photo-1778518732710-0c8a20de31e6", slug: "abommZgsArk", r: 0.5627, alt: "White horse grazing in a field with a forest behind" },
        { p: "photo-1778518731991-16dae7822e42", slug: "bpqB4Carw3U", r: 0.5627, alt: "Snow-capped mountain peak seen from a dirt road" },
        { p: "photo-1778518730726-7a6bc51807a8", slug: "VXnji-Isuds", r: 0.5627, alt: "Snow-capped mountains under a pale blue sky" },
        { p: "photo-1778518731800-25dac07780a6", slug: "lgBXERQ8jr0", r: 1.7773, alt: "Majestic snow-covered mountains under a cloudy sky" },
        { p: "photo-1771257351392-a66ce1e4b350", slug: "g_w6wIZdEdY", r: 0.6667, alt: "Dark stone carving of a buddhist deity holding a fan" },
        { p: "photo-1771257348039-619a479b0da3", slug: "6zXjdYv0jGE", r: 0.5627, alt: "Ornate buddha statue with intricate floral backdrop" },
        { p: "photo-1771257353459-6859eb576b7f", slug: "WR37i2JQ53M", r: 0.6667, alt: "Stone carving of a deity with a cobra hood" },
        { p: "photo-1771257348897-3c63539b82e6", slug: "reV9Pp6FpfQ", r: 1.5531, alt: "" },
        { p: "photo-1771257350846-ff4af8ef91cd", slug: "wmclsnQd7Tw", r: 0.6667, alt: "Ornate brass shrine with deity and lions" },
        { p: "photo-1771257352279-e708a27c72c4", slug: "mR_eJspVqZQ", r: 0.6667, alt: "Ornate wooden pillar with a small deity statue" },
        { p: "photo-1771257330319-19a62baba2f4", slug: "xj-AS91YCzQ", r: 0.6667, alt: "Stone statue of a buddhist deity holding a ritual object" },
        { p: "photo-1771257355043-49fd0fdbd2c4", slug: "__ZvAyVYOZ8", r: 1.5, alt: "" },
        { p: "photo-1771257354155-89f4215a0ce8", slug: "zwFEc7WvaJ4", r: 0.6667, alt: "Ornate statue of buddha in a decorative shrine" },
        { p: "photo-1771257340998-a28e655af49c", slug: "otGEs9pKulE", r: 1.5, alt: "Ancient buddha statue with intricate details" },
        { p: "photo-1771257344651-7be486876d3a", slug: "2uNzMFlQhDA", r: 1.5, alt: "" },
        { p: "photo-1771257349971-a05a9fe6897b", slug: "6bsgvOz0OQM", r: 1.7773, alt: "A small bird foraging on a rocky surface" },
        { p: "photo-1771257348994-f5b0c4014186", slug: "sdc5lSb7jBc", r: 1.5, alt: "" },
        { p: "photo-1771257356271-521510c79662", slug: "Fi03CXh0h_w", r: 0.6667, alt: "" },
        { p: "photo-1771257348804-5f51a9a07678", slug: "iJMmObt5rgc", r: 0.6667, alt: "Ornate dark wooden roof details against white sky" },
        { p: "photo-1771257356485-1b35199f0840", slug: "XTzl_gCXtto", r: 0.5627, alt: "" },
        { p: "photo-1771257355214-27faeb8b3196", slug: "DtnO2h5aIv8", r: 0.6667, alt: "A bronze monkey statue holds a ball in its hands" },
        { p: "photo-1771257352129-e9542ac05ea0", slug: "xEB5k1l85_E", r: 1.5, alt: "" },
        { p: "photo-1771257349616-1b65a95d73b1", slug: "W6WJ45ZrBBk", r: 0.6667, alt: "" },
        { p: "photo-1771257356292-4b2c67f2090a", slug: "f7KJqj8n-AE", r: 1.9286, alt: "" },
        { p: "photo-1771257355407-01049bed23a6", slug: "XVf2rxbvF1A", r: 1.5, alt: "" },
        { p: "photo-1771257341467-d8563b72f6a7", slug: "-E2XCRNdhUI", r: 1.5, alt: "Ornate statue of buddha with intricate details" },
        { p: "photo-1771257339579-3e9126b1aef2", slug: "9lJeL7z-Is4", r: 0.6667, alt: "" },
        { p: "photo-1771257339560-0c2c94b7f404", slug: "-Z-hv1E76Lc", r: 0.6667, alt: "Intricately carved ancient statue of a deity" },
        { p: "photo-1771257356466-f4c72e371c51", slug: "K3YQYiNI5W8", r: 0.5627, alt: "A multi-armed statue of a deity in ornate shrine" },
        { p: "photo-1771257354638-63c6f56aa040", slug: "CEgtr1rYS9k", r: 0.6667, alt: "Ornate bronze statue of a seated deity with intricate details" },
        { p: "photo-1771257347971-16c314da2335", slug: "cz4dLGjMTDI", r: 0.6667, alt: "" },
        { p: "photo-1771257348264-285f795ddab5", slug: "ipgAbg_LAtc", r: 0.6667, alt: "" },
        { p: "photo-1771257346504-f48dcf34ae98", slug: "sVn4UisKMe8", r: 1.5, alt: "" },
        { p: "photo-1771257339834-38c600b7b8c2", slug: "rmaU8q2qe28", r: 0.6667, alt: "A metal figurine of a person praying" },
        { p: "photo-1771257344640-7e9628e26e02", slug: "d67mlg4vwds", r: 1.5, alt: "" },
        { p: "photo-1771257324454-531a24e03863", slug: "sKnI1YQAn60", r: 0.6667, alt: "" },
        { p: "photo-1771257335981-d5dd155b4e5d", slug: "eGdcxkut-wE", r: 0.5684, alt: "" },
        { p: "photo-1771257356182-521dbfe405cf", slug: "s7W4U43zI6I", r: 1.5, alt: "A shrine with a large statue and smaller figures" },
        { p: "photo-1771257356615-89842a2c7e67", slug: "ueSEq92YpW0", r: 0.6667, alt: "Intricate stone carving of a deity in a temple niche" },
        { p: "photo-1771257348337-eb00cf0ca4d8", slug: "FB9cIb3sQCI", r: 1.5, alt: "Detailed ancient metal statue of a deity" },
        { p: "photo-1771257356371-e628a0883ae4", slug: "7tFYIWV6yWs", r: 0.6667, alt: "A stone statue of buddha in meditation pose" },
        { p: "photo-1771257354360-2047f1d652c5", slug: "SiTEQFWCXV0", r: 0.6667, alt: "Ornate bronze shrine with a deity and lions" },
        { p: "photo-1771257347689-04f2411f87c7", slug: "rh4f-lCc26k", r: 0.6667, alt: "A stone statue of buddha in a meditative pose" },
        { p: "photo-1771257345068-21260f8538dd", slug: "xGdk58N0-O4", r: 0.6667, alt: "" },
        { p: "photo-1771257354556-dd65f4c9139e", slug: "KEE1QoyYYi4", r: 1.5, alt: "" },
        { p: "photo-1771257336746-93eb1aa42d39", slug: "iSrI88NfdYE", r: 1.5, alt: "" },
        { p: "photo-1771257344816-7d62bec7a9f3", slug: "bZMRxTZ18RE", r: 0.6667, alt: "Ornate golden deity statue within a temple structure" },
        { p: "photo-1771257330405-122667799552", slug: "V2dwtDvWd7E", r: 0.5743, alt: "A golden buddha statue sits on an ornate altar" },
        { p: "photo-1771257354301-7f9fad1789a1", slug: "hXsx1XGdYdA", r: 1.5, alt: "" },
        { p: "photo-1771257328402-d579d0a2f928", slug: "b5P4Su3D3WY", r: 1.5, alt: "Row of lit candles in dark setting" },
        { p: "photo-1771257344744-760806c58c65", slug: "VRrVP7nDvRE", r: 1.5, alt: "" },
        { p: "photo-1771257349046-2bd1a1513c7d", slug: "68_VE-D7yVA", r: 0.6667, alt: "" },
        { p: "photo-1771257351822-18a073a5d695", slug: "mOrv2-bGREI", r: 1.4999, alt: "" },
        { p: "photo-1771257356322-237b0a2438bd", slug: "6OgTVHu3xbk", r: 1.5, alt: "Intricate stone carvings on an ancient building facade" },
        { p: "photo-1771257346958-7bac7df81256", slug: "TB8z5rHY3Ew", r: 0.6666, alt: "A serene buddha statue sits before an ornate wooden door" },
        { p: "photo-1771257356526-ad64db835939", slug: "W4skuI-H7qs", r: 1.5, alt: "" },
        { p: "photo-1771257348913-e8ea02c74341", slug: "JKQAbvAt6n0", r: 0.6667, alt: "" },
        { p: "photo-1771257344664-aac6b9a4ae6b", slug: "P9_uZUTVuJA", r: 0.6667, alt: "" },
        { p: "photo-1771257347600-1c4f6d531dc3", slug: "yVOFb2eRxa0", r: 0.6667, alt: "Stone carving of a mythical creature with wings and scales" },
        { p: "photo-1771257349526-ba7ad17c8b68", slug: "UqRpC5sNVzI", r: 1.5, alt: "A small golden buddha statue sits on a decorative base" },
        { p: "photo-1771257352899-92c53d448252", slug: "leC1Ri8v7_0", r: 1.5, alt: "A building atop a forested hill under a cloudy sky" },
        { p: "photo-1771257356439-9781706d5ca5", slug: "F6iVccw6zAg", r: 0.6667, alt: "Stone carving of a multi-armed deity in prayer" },
        { p: "photo-1771257329173-78c40fe3b886", slug: "LyDG7eR2-TE", r: 1.5, alt: "Many lit candles in brass holders on a dark surface" },
        { p: "photo-1771257353964-ef8b391cf000", slug: "HBbJpJDUYfk", r: 1.5, alt: "" },
        { p: "photo-1771257352255-58671bdc7991", slug: "J5bOB4UK0xE", r: 0.6667, alt: "" },
        { p: "photo-1761029812752-4aab9c807647", slug: "NZtK4iA1vg4", r: 1.6579, alt: "Snow-capped mountains under a clear blue sky" },
        { p: "photo-1761029812682-03998ddb2e5d", slug: "wkO6Hi-RMTk", r: 1.5, alt: "Snow-covered mountain range under a dark sky" },
        { p: "photo-1759240129222-c9710d17aac4", slug: "PebSDE6_LgM", r: 1.5, alt: "Deer with antlers in a dark forest setting" },
        { p: "photo-1759240114985-5a9fb70f733e", slug: "bI44waMYZDE", r: 0.6667, alt: "A vulture with light brown feathers sits on a branch" },
        { p: "photo-1759240139798-3e7e45a1d3e3", slug: "cb1gq2rgGyQ", r: 0.6667, alt: "Tiger walking through dark forest foliage" },
        { p: "photo-1759240120322-bb2ccb5c1084", slug: "PILD8suljyw", r: 1.5, alt: "A vulture perched on a branch in a dark enclosure" },
        { p: "photo-1759240122626-f2436223e894", slug: "PdzadaFMD1I", r: 0.635, alt: "An elephant is standing with its trunk raised" },
        { p: "photo-1759240149384-a850fba6d65f", slug: "e24OeXvoIBA", r: 0.6667, alt: "Brick temple spire against a cloudy sky" },
        { p: "photo-1759239918740-7d1b255f79a9", slug: "sCQPEfyA6s0", r: 0.6493, alt: "Statue of Buddha" },
        { p: "photo-1759239918780-62f8a9d6a92c", slug: "Hu07nyzLg90", r: 0.6667, alt: "" },
        { p: "photo-1759239918746-a4ff878d1bfb", slug: "lPyFoN8_0Ak", r: 0.6667, alt: "Bhairav Statue" },
        { p: "photo-1756296754069-d6985f9a2437", slug: "Qt5gSba6n7c", r: 0.6667, alt: "Close-up of an ostrich's head and neck" },
        { p: "photo-1756296753795-16fea3c6b521", slug: "dGmQGYgy3eA", r: 1.5, alt: "Tiger resting on a wooden platform with stone background" },
        { p: "photo-1756296753682-83d185c73eeb", slug: "l8Tbam2BEVQ", r: 0.6842, alt: "A tiger rests in lush green foliage near a tree" },
        { p: "photo-1756296753977-5e3d85050c08", slug: "adIijv9XYtQ", r: 0.6667, alt: "A vulture with grey feathers and white neck" },
        { p: "photo-1756233485584-9343b25b1d72", slug: "E3mnt1GyT10", r: 0.6667, alt: "A tiger walks through a dark forest" },
        { p: "photo-1756229136788-7b9a13b7e429", slug: "crFPmiYuZQg", r: 0.6667, alt: "Tiger roaring with mouth open in dark forest" },
        { p: "photo-1755538707490-e12ed61c3153", slug: "M3UcsgD5a4M", r: 0.6667, alt: "" },
        { p: "photo-1755538707334-668e0106314b", slug: "bFNnjZj8-Wg", r: 1.5, alt: "A small grasshopper rests on a green leaf" },
        { p: "photo-1755538707291-873f3d068543", slug: "OghpnDtEJHo", r: 0.6667, alt: "Wooden stairs with blue railings ascend a hillside" },
        { p: "photo-1755538707367-d947cb695461", slug: "DV6QqKyJmtY", r: 1.5, alt: "Spider web with dew drops on green grass" },
        { p: "photo-1755538707719-b2ad0e726ac0", slug: "BwSHeYB2Szo", r: 0.6667, alt: "" },
        { p: "photo-1755537299541-4cd6672f40ad", slug: "XJD5mVcMNCw", r: 0.6667, alt: "" },
        { p: "photo-1755537299640-188c9016e55c", slug: "0Gw9MlJRvRE", r: 0.6667, alt: "Pigeons gather on rooftops near ancient temples" },
        { p: "photo-1755537299558-f42dbc94df02", slug: "29KMiR7IxO0", r: 0.6667, alt: "Traditional pagoda temple seen through arched window" },
        { p: "photo-1755279974553-25e89064dc49", slug: "r6ZGa-xpKIU", r: 1.5, alt: "Ornate wooden window with intricate carvings and latticework" },
        { p: "photo-1755279692842-d53a34a90539", slug: "ROXSpeqaA5c", r: 1.5, alt: "A dormer window on a moss-covered roof" },
        { p: "photo-1755279692902-86b15b3f8c4a", slug: "LZ-Cucif7Fc", r: 1.5, alt: "" },
        { p: "photo-1755279692866-1cc8a7867a4f", slug: "9kDKKwR6u64", r: 1.6779, alt: "A pigeon stands near a water source" },
        { p: "photo-1755279692896-073477f2b17e", slug: "WdzJ3Ndcrzs", r: 1.5, alt: "Intricate wooden carvings adorn ancient temple architecture" },
        { p: "photo-1755279692943-08bf9e8db79c", slug: "RRA74pzSAjw", r: 0.6667, alt: "Stone lion statues guard ancient temple entrance" },
        { p: "photo-1755279692917-52368297aa15", slug: "uB66d0c8htc", r: 0.6667, alt: "Ornate stone temple with tiered roof and pillars" },
        { p: "photo-1755279693121-0d045b260c3a", slug: "P63MBVza3KU", r: 0.6667, alt: "People walk past a large flowering tree outdoors" },
        { p: "photo-1755279692948-4788ce11f05d", slug: "4rLFKgf2lzA", r: 0.6667, alt: "Golden eagle statue with pigeons perched on it" },
        { p: "photo-1755279692925-bf20b4375b42", slug: "WuXfTUWPHj0", r: 0.6667, alt: "" },
        { p: "photo-1755279692966-253b7cd32138", slug: "omW_Y3wOxpA", r: 0.6667, alt: "" },
        { p: "photo-1755279692948-446c7ca7d1d9", slug: "28QzGATbDis", r: 0.6667, alt: "Pigeons perch on ornate ancient stone temple carvings" },
        { p: "photo-1755279693270-89de6cd48d11", slug: "qLvlwdSQ3yM", r: 0.6183, alt: "Three statues adorned with garlands in a shrine" },
        { p: "photo-1755279692997-9c877af80040", slug: "lwNIUuSclRY", r: 1.5, alt: "Stone statue of a seated figure in ancient ruins" },
        { p: "photo-1755279692888-0019fa3ac5e5", slug: "FzPYMrzSipY", r: 1.5, alt: "Close-up of a dark pigeon with iridescent neck feathers" },
        { p: "photo-1755194370954-a42c73afcf2b", slug: "h6oLvooHZ7g", r: 1.5, alt: "Throne Back for Dieties" },
        { p: "photo-1755194370998-8e75239ebf68", slug: "gLE4-1ZB1sU", r: 0.6861, alt: "" },
        { p: "photo-1755194370999-7516bc06aae8", slug: "1amQOInZD08", r: 0.8126, alt: "" },
        { p: "photo-1755194370951-0419413fe5f0", slug: "PjuTUgKvxh0", r: 0.6477, alt: "" },
        { p: "photo-1755192085001-fead96dbadb2", slug: "VxALAlzizYo", r: 0.6667, alt: "Ancient stone carving with detailed figures and scenes" },
        { p: "photo-1755192085005-14aa70a677e4", slug: "2wEgFgXny5s", r: 1.5704, alt: "Intricate stone carving of a seated figure and cherubs" },
        { p: "photo-1755192084993-7d7dacf43c09", slug: "jxTUJzjSD4U", r: 0.6667, alt: "Ancient stone buddha head with serene expression" },
        { p: "photo-1755192085031-0c16b00855c2", slug: "4PTav91QT_o", r: 0.6667, alt: "Wooden staircase in a dimly lit hallway" },
        { p: "photo-1755189588922-4d26f737d42b", slug: "CnslUINchj8", r: 0.6667, alt: "Process of Crafting Metal Statue of Buddha, Placed in Patan Durbar Square Museum." },
        { p: "photo-1751200308694-04077bcf622f", slug: "0KPYLeVyRS4", r: 0.75, alt: "" },
        { p: "photo-1751200238611-03bbc08d8960", slug: "fFR4_01FRAM", r: 0.75, alt: "" },
        { p: "photo-1750428270012-930ac8aff8aa", slug: "ZAHTiAp9jbk", r: 1.5, alt: "" },
        { p: "photo-1750428273004-6e794e4e56d6", slug: "Aj_FOWBFlwA", r: 0.6667, alt: "" },
        { p: "photo-1750428257376-ba1d137696ea", slug: "zl0SkGczPTk", r: 0.75, alt: "" },
        { p: "photo-1750262603595-931a3d5529b8", slug: "qATPBo9G-E8", r: 0.7241, alt: "" },
        { p: "photo-1749546108928-3f6ce101e878", slug: "-SiLxT7yKbw", r: 0.75, alt: "" },
        { p: "photo-1749545965780-15413598279e", slug: "dDKnEP6QvEE", r: 0.75, alt: "Hari Hari Haribahana Lokeshwor Statue" },
        { p: "photo-1748593021771-f419ce080b98", slug: "dogsBxGQ6Os", r: 0.75, alt: "" },
        { p: "photo-1748593049907-0adaaa181246", slug: "62zgGTEt2mo", r: 0.75, alt: "" },
        { p: "photo-1748592763526-a8cccd4de1e5", slug: "BpS5GHT2p_M", r: 0.75, alt: "" },
        { p: "photo-1748592688766-5415dadc3dbb", slug: "FXsvqZh1-6g", r: 0.75, alt: "" },
        { p: "photo-1748592598219-37e9288ba54c", slug: "qFGEUtlwHhw", r: 0.75, alt: "" },
        { p: "photo-1748592407737-092aff2e21d6", slug: "WXc8n4S2OJI", r: 0.75, alt: "" },
        { p: "photo-1748592228923-39fa4fa9994d", slug: "k8itvxe1EOA", r: 0.75, alt: "" },
        { p: "photo-1748592110370-5857bd33bff7", slug: "4Ydqc0WUnk0", r: 0.75, alt: "" },
        { p: "photo-1748592038510-7752a578be11", slug: "h12vzP01vWM", r: 0.75, alt: "" },
        { p: "photo-1748591861652-17d8b2fe164f", slug: "gemYrjrituY", r: 0.75, alt: "A bronze dragon adorns an ornate pillar" },
        { p: "photo-1748591184748-c23fbd17e431", slug: "-ryGD49seic", r: 0.75, alt: "Oku Bahal Rudra Varna Mahavihar" }
    ];

    // 90% quality in the best format the browser supports (AVIF/WebP): looks identical, far lighter.
    // The viewer shows a 2560px copy; "Full resolution" opens the untouched original.
    var url = function (p, width) { return 'https://images.unsplash.com/' + p.p + '?w=' + width + '&q=90&auto=format&fit=max'; };
    var original = function (p) { return 'https://images.unsplash.com/' + p.p; };
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
    var label = function (p) { return p.alt ? p.alt.charAt(0).toUpperCase() + p.alt.slice(1) : UNTITLED; };

    var grid = document.getElementById('photo-grid');
    if (!grid) return;
    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var countEl = document.getElementById('ph-count');
    var moreBtn = document.getElementById('ph-more');
    var shown = 0;

    // ---------------- grid (rendered in batches) ----------------
    function renderBatch(upTo) {
        var end = Math.min(PHOTOS.length, Math.max(upTo, shown + BATCH));
        var html = '';
        for (var i = shown; i < end; i++) {
            var p = PHOTOS[i], l = esc(label(p));
            html += '<figure class="ph"><button type="button" class="ph__btn" data-i="' + i + '" style="aspect-ratio:' + p.r + '" aria-label="Open photo: ' + l + '">' +
                '<img src="' + url(p, 640) + '" srcset="' + url(p, 420) + ' 420w, ' + url(p, 640) + ' 640w, ' + url(p, 960) + ' 960w" sizes="(min-width:1280px) 24vw, (min-width:900px) 32vw, 48vw" alt="' + l + '" width="' + Math.round(p.r * 400) + '" height="400" loading="' + (i < 8 ? 'eager' : 'lazy') + '" decoding="async">' +
                '<span class="ph__cap">' + (p.alt ? esc(label(p)) : 'View photo') + '<span aria-hidden="true">↗</span></span></button></figure>';
        }
        var tmp = document.createElement('div'); tmp.innerHTML = html;
        var fresh = Array.prototype.slice.call(tmp.children);
        fresh.forEach(function (fig) {
            var im = fig.querySelector('img'), on = function () { im.classList.add('on'); };
            if (im.complete && im.naturalWidth) on(); else { im.addEventListener('load', on); im.addEventListener('error', on); }
            grid.appendChild(fig);
        });
        shown = end;
        if (countEl) countEl.textContent = 'Showing ' + shown + ' of ' + PHOTOS.length + ' photos';
        if (moreBtn) {
            moreBtn.hidden = shown >= PHOTOS.length;
            moreBtn.firstChild.nodeValue = 'Show ' + Math.min(BATCH, PHOTOS.length - shown) + ' more photos ';
        }
    }
    renderBatch(BATCH);
    if (moreBtn) moreBtn.addEventListener('click', function () { renderBatch(shown + BATCH); });

    // ---------------- hero marquee: two rows of photos drifting in opposite directions ----------------
    var marq = document.getElementById('ph-marq');
    if (marq) {
        var pick = function (mod, n) { var out = []; for (var i = mod; i < PHOTOS.length && out.length < n; i += 4) out.push(i); return out; };
        var group = function (idx, hidden) {
            return '<div class="ph-group"' + (hidden ? ' aria-hidden="true"' : '') + '>' + idx.map(function (i) {
                var p = PHOTOS[i], l = esc(label(p));
                return '<button type="button" class="ph-m" data-mi="' + i + '" style="width:calc(var(--mh) * ' + p.r + ')"' + (hidden ? ' tabindex="-1"' : ' aria-label="Open photo: ' + l + '"') + '>' +
                    '<img src="' + url(p, 720) + '" alt="' + (hidden ? '' : l) + '" width="' + Math.round(p.r * 200) + '" height="200" decoding="async"></button>';
            }).join('') + '</div>';
        };
        var row = function (idx, cls) { return '<div class="ph-row"><div class="ph-track ' + cls + '">' + group(idx, false) + group(idx, true) + '</div></div>'; };
        marq.innerHTML = row(pick(0, 26), '') + row(pick(2, 26), 'rev');
        Array.prototype.forEach.call(marq.querySelectorAll('img'), function (im) {
            var on = function () { im.classList.add('on'); };
            if (im.complete && im.naturalWidth) on(); else { im.addEventListener('load', on); im.addEventListener('error', on); }
        });
        marq.addEventListener('click', function (e) { var b = e.target.closest('.ph-m'); if (b) open(+b.dataset.mi, b); });
    }

    // ---------------- viewer ----------------
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML =
        '<div class="lb__bg"></div>' +
        '<div class="lb__top"><span class="lb__count"></span><button type="button" class="lb__btn lb__close" aria-label="Close viewer">✕</button></div>' +
        '<figure class="lb__stage"><img class="lb__img" alt=""></figure>' +
        '<button type="button" class="lb__btn lb__nav lb__prev" aria-label="Previous photo">←</button>' +
        '<button type="button" class="lb__btn lb__nav lb__next" aria-label="Next photo">→</button>' +
        '<div class="lb__bar"><div><p class="lb__title"></p><p class="lb__by">' + BY + '</p></div><div class="lb__links"><a class="lb__buy">Buy this photo ↗</a><a class="lb__link lb__full" target="_blank" rel="noopener noreferrer">Full resolution ↗</a><a class="lb__link lb__unsplash" target="_blank" rel="noopener noreferrer">View on Unsplash ↗</a></div></div>';
    document.body.appendChild(lb);
    var q = function (s) { return lb.querySelector(s); };
    var stage = q('.lb__stage'), img = q('.lb__img'), count = q('.lb__count'), title = q('.lb__title'), link = q('.lb__unsplash'), full = q('.lb__full'), buy = q('.lb__buy'), closeBtn = q('.lb__close');

    var cur = -1, opener = null, openerIdx = -1, busy = false, dur = reduce ? 0 : 520;
    var pad = function (n) { return String(n).padStart(3, '0'); };

    function thumbOf(i) { var b = grid.querySelector('[data-i="' + i + '"]'); return b ? b.querySelector('img') : null; }
    function fit(p) {                       // size of the photo inside the stage
        var r = stage.getBoundingClientRect(), w = Math.min(r.width, r.height * p.r);
        return { w: Math.round(w), h: Math.round(w / p.r) };
    }
    function setPhoto(i, thumbSrc) {
        var p = PHOTOS[i]; cur = i;
        var f = fit(p);
        img.style.width = f.w + 'px'; img.style.height = f.h + 'px';
        img.alt = label(p);
        img.src = thumbSrc || url(p, 900);
        var big = new Image();               // upgrade to the large version once it has loaded
        big.onload = function () { if (cur === i) img.src = big.src; };
        big.src = url(p, 2560);
        count.textContent = pad(i + 1) + ' / ' + pad(PHOTOS.length);
        title.textContent = label(p);
        link.href = 'https://unsplash.com/photos/' + p.slug;
        full.href = original(p);
        buy.href = 'mailto:saagarshrest@gmail.com?subject=' + encodeURIComponent('Photo purchase enquiry: ' + label(p) + ' (' + p.slug + ')') +
            '&body=' + encodeURIComponent('Hi Saagar,\n\nI would like to buy this photo:\n' + label(p) + '\nhttps://unsplash.com/photos/' + p.slug + '\n\nHow I would use it (print, website, editorial, other):\n');
        [i - 1, i + 1].forEach(function (n) { if (PHOTOS[n]) { var pre = new Image(); pre.src = url(PHOTOS[n], 2560); } });
    }
    function flip(fromRect, then) {          // animate the photo between a thumbnail and the stage
        var to = img.getBoundingClientRect();
        var sx = fromRect.width / to.width, sy = fromRect.height / to.height;
        var dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2);
        var dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
        img.style.transition = 'none';
        img.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
        img.getBoundingClientRect();
        img.style.transition = 'transform ' + dur + 'ms cubic-bezier(.16,1,.3,1)';
        img.style.transform = 'none';
        if (then) setTimeout(then, dur);
    }

    function open(i, btn) {
        if (busy) return;
        opener = btn; openerIdx = i; busy = true;
        var t = (btn && btn.querySelector('img')) || thumbOf(i), rect = t.getBoundingClientRect();
        lb.hidden = false; root.classList.add('lb-open');
        setPhoto(i, t.currentSrc || t.src);
        img.style.opacity = '1';
        requestAnimationFrame(function () {
            lb.classList.add('open');
            flip(rect, function () { busy = false; closeBtn.focus({ preventScroll: true }); });
        });
    }
    function close() {
        if (busy || lb.hidden) return;
        busy = true; lb.classList.remove('open');
        var t = (opener && openerIdx === cur && document.body.contains(opener)) ? opener.querySelector('img') : thumbOf(cur), vis = false, r;
        if (t) { r = t.getBoundingClientRect(); vis = r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth; }
        var done = function () {
            lb.hidden = true; root.classList.remove('lb-open'); img.style.transform = 'none'; img.style.opacity = '1'; busy = false;
            var b = (opener && openerIdx === cur) ? opener : grid.querySelector('[data-i="' + cur + '"]'); (b || opener) && (b || opener).focus({ preventScroll: true });
        };
        if (vis && !reduce) {
            var to = img.getBoundingClientRect();
            var dx = r.left + r.width / 2 - (to.left + to.width / 2), dy = r.top + r.height / 2 - (to.top + to.height / 2);
            img.style.transition = 'transform ' + dur + 'ms cubic-bezier(.65,0,.35,1)';
            img.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + (r.width / to.width) + ',' + (r.height / to.height) + ')';
            setTimeout(done, dur);
        } else {
            img.style.transition = 'opacity .3s ease'; img.style.opacity = '0'; setTimeout(done, 320);
        }
    }
    function go(step) {
        var n = cur + step;
        if (busy || n < 0 || n >= PHOTOS.length) return;
        busy = true;
        img.style.transition = 'opacity .18s ease'; img.style.opacity = '0';
        setTimeout(function () {
            if (n >= shown) renderBatch(n + 1);                               // make sure the closing target exists
            setPhoto(n);
            var t = thumbOf(n); if (t) t.scrollIntoView({ block: 'center' });   // keep the closing target on screen
            img.style.opacity = '1'; busy = false;
        }, 190);
    }

    grid.addEventListener('click', function (e) {
        var b = e.target.closest('.ph__btn'); if (b) open(+b.dataset.i, b);
    });
    closeBtn.addEventListener('click', close);
    q('.lb__bg').addEventListener('click', close);
    stage.addEventListener('click', function (e) { if (e.target === stage) close(); });
    q('.lb__prev').addEventListener('click', function () { go(-1); });
    q('.lb__next').addEventListener('click', function () { go(1); });
    document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        else if (e.key === 'Tab') {                                  // keep focus inside the viewer
            var f = lb.querySelectorAll('button, a[href]'); if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    lb.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    var tx = 0;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }, { passive: true });
    window.addEventListener('resize', function () { if (!lb.hidden && cur > -1) { var f = fit(PHOTOS[cur]); img.style.width = f.w + 'px'; img.style.height = f.h + 'px'; } });

    Array.prototype.forEach.call(document.querySelectorAll('[data-unsplash-profile]'), function (a) { a.href = PROFILE; });
})();
