// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_KEY = process.env.REACT_APP_API_KEY;

/**
 * Generate a travel report using the AI service
 * @param {Object} data - The form data
 * @returns {Promise} - The AI generated report
 */
export const generateAIReport = async (data) => {
  try {
    // 如果 API 服务可用，使用实际的 API 调用
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3001/api') {
      const response = await fetch(`${API_BASE_URL}/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } else {
      // 如果 API 服务不可用，使用模拟数据
      console.log('Using mock data for AI report generation');
      
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据表单数据生成模拟报告
      const mockReport = generateMockReport(data);
      
      return {
        success: true,
        data: mockReport
      };
    }
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

/**
 * 生成模拟的旅行报告（Markdown 格式）
 * @param {Object} data - 表单数据
 * @returns {Object} - 模拟的旅行报告
 */
const generateMockReport = (data) => {
  const { departure_country, destination, stopover_date, stopover_duration, interests, budget } = data;
  
  // 提取城市名称（去掉省份前缀）
  const cityName = destination.includes('-') ? destination.split('-')[1] : destination;
  
  // 格式化日期
  const formattedDate = new Date(stopover_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // 根据停留时间确定报告类型
  const durationType = stopover_duration <= 12 ? 'short' : stopover_duration <= 72 ? 'medium' : 'long';
  
  // 生成报告标题
  const title = `${cityName} Stopover Guide: ${stopover_duration} Hour Itinerary`;
  
  // 生成介绍部分（Markdown 格式）
  const introduction = `# Welcome to ${cityName}!

This personalized guide has been created for your **${stopover_duration}-hour stopover** in ${cityName} on ${formattedDate}. Based on your preferences and interests${interests.length > 0 ? ` (${interests.join(', ')})` : ''}, we've curated recommendations that fit within your ${budget} budget and time constraints.

Below you'll find a detailed itinerary, transportation options, dining recommendations, and essential tips to make the most of your brief stay in this fascinating city.`;

  // 生成报告各部分内容
  const sections = [
    {
      title: "Itinerary Overview",
      content: `## Your ${stopover_duration}-Hour Itinerary

${generateItinerary(cityName, stopover_duration, interests, budget)}

> **Note:** This itinerary is flexible and can be adjusted based on your arrival/departure times and energy levels.`
    },
    {
      title: "Transportation from Airport",
      content: `## Getting from the Airport to the City

${generateTransportationInfo(cityName, budget)}

### Return to Airport

* **Buffer Time:** Ensure you return to the airport at least **2 hours** before your international flight.
* **Last Train/Bus:** Check the schedule for the last airport express train or bus if your departure is late evening.`
    },
    {
      title: "Dining Recommendations",
      content: `## Where to Eat During Your Stopover

${generateDiningRecommendations(cityName, budget, interests.includes('Food & Cuisine'))}

### Quick Bites for Short Layovers

* Airport Food Courts: Terminal ${Math.floor(Math.random() * 3) + 1} has the best options
* Grab-and-go local snacks from convenience stores
* Bottled water and snacks for your onward journey`
    },
    {
      title: "Essential Tips",
      content: `## Practical Information

### Currency
* Chinese Yuan (CNY) is the local currency
* ATMs are available at the airport and throughout the city
* Major credit cards accepted at most establishments

### Language
* Mandarin Chinese is the official language
* English proficiency varies; higher in tourist areas
* Consider downloading a translation app

### Luggage Storage
* Available at the airport (Terminal ${Math.floor(Math.random() * 3) + 1}, Arrivals Level)
* Major train stations also offer storage services
* Costs approximately 20-50 CNY depending on size

### Internet Access
* Free Wi-Fi available at the airport (connect to "Airport_Free_WiFi")
* Many cafes and restaurants offer free Wi-Fi
* Consider a portable Wi-Fi device or local SIM card for continuous connectivity

### Emergency Contacts
* Police: 110
* Ambulance: 120
* Tourist Police Hotline: 12345`
    }
  ];
  
  return {
    title,
    introduction,
    sections
  };
};

/**
 * 生成模拟的行程安排
 */
const generateItinerary = (cityName, duration, interests, budget) => {
  // 根据不同城市和停留时间生成不同的行程
  const cityAttractions = {
    'Beijing': ['Forbidden City', 'Temple of Heaven', 'Summer Palace', 'Great Wall (Mutianyu section)', 'Wangfujing Street'],
    'Shanghai': ['The Bund', 'Yu Garden', 'Shanghai Tower', 'Nanjing Road', 'Tianzifang'],
    'Guangzhou': ['Canton Tower', 'Chen Clan Ancestral Hall', 'Shamian Island', 'Beijing Road', 'Yuexiu Park'],
    'Xian': ['Terracotta Army', 'City Wall', 'Muslim Quarter', 'Big Wild Goose Pagoda', 'Bell Tower'],
    'Chengdu': ['Giant Panda Breeding Research Base', 'Jinli Street', 'Wuhou Shrine', 'Kuanzhai Alley', 'Wenshu Monastery'],
    'Hangzhou': ['West Lake', 'Lingyin Temple', 'Hefang Street', 'Leifeng Pagoda', 'Xixi Wetland']
  };
  
  // 默认使用北京的景点，如果没有特定城市的数据
  const attractions = cityAttractions[cityName] || cityAttractions['Beijing'];
  
  // 根据停留时间选择景点数量
  const numAttractions = duration <= 6 ? 1 : duration <= 12 ? 2 : duration <= 24 ? 3 : 4;
  
  // 根据兴趣筛选景点
  let selectedAttractions = [...attractions].sort(() => 0.5 - Math.random()).slice(0, numAttractions);
  
  // 生成行程表
  let itinerary = '';
  
  if (duration <= 6) {
    itinerary = `### Express Highlights (${duration} hours)

Given your very short stopover, we recommend focusing on just one key attraction:

1. **${selectedAttractions[0]}** (2-3 hours)
   * One of ${cityName}'s most iconic landmarks
   * Easily accessible from the airport
   * Perfect for a brief cultural immersion

The rest of your time should be allocated for airport transfers and security procedures.`;
  } else if (duration <= 12) {
    itinerary = `### Half-Day Exploration (${duration} hours)

Your ${duration}-hour stopover allows for a brief but meaningful visit to ${cityName}:

1. **${selectedAttractions[0]}** (2 hours)
   * Begin your exploration at this iconic site
   * Morning is the best time to avoid crowds

2. **${selectedAttractions[1]}** (2 hours)
   * Just a short distance from your first stop
   * Offers a different perspective of the city

3. **Local Dining Experience** (1 hour)
   * Try local specialties at a nearby restaurant
   * Quick service options available

The remaining time accounts for transportation to/from the airport and security procedures.`;
  } else if (duration <= 24) {
    itinerary = `### Full-Day Adventure (${duration} hours)

With ${duration} hours, you can experience several of ${cityName}'s highlights:

#### Morning
1. **${selectedAttractions[0]}** (2-3 hours)
   * Start early to beat the crowds
   * Take your time exploring this iconic attraction

#### Afternoon
2. **${selectedAttractions[1]}** (2 hours)
   * A short taxi/subway ride from your morning location
   * Perfect for afternoon exploration

3. **${selectedAttractions[2]}** (2 hours)
   * Experience another facet of ${cityName}'s culture
   * Shopping opportunities available nearby

#### Evening
4. **Dinner and Local Experience** (2 hours)
   * Enjoy authentic cuisine at a local restaurant
   * Experience the city's nighttime atmosphere

The remaining time accounts for hotel check-in (if applicable), transportation, and airport procedures.`;
  } else {
    itinerary = `### Extended Stopover (${duration} hours)

Your generous ${duration}-hour stopover allows for an in-depth exploration of ${cityName}:

#### Day 1
1. **${selectedAttractions[0]}** (3 hours)
   * Begin your adventure at this must-see attraction
   * Take your time to fully appreciate the experience

2. **${selectedAttractions[1]}** (2-3 hours)
   * Continue to this nearby cultural highlight
   * Stop for lunch at a local restaurant en route

3. **Evening Entertainment** (2 hours)
   * Consider a cultural performance or night market
   * Experience local nightlife

#### Day 2
4. **${selectedAttractions[2]}** (3 hours)
   * Start your second day with this popular attraction
   * Morning visits typically offer smaller crowds

5. **${selectedAttractions[3]}** (2 hours)
   * Complete your ${cityName} experience
   * Perfect for last-minute shopping or photos

The remaining time accounts for hotel, transportation, meals, and airport procedures.`;
  }
  
  return itinerary;
};

/**
 * 生成模拟的交通信息
 */
const generateTransportationInfo = (cityName, budget) => {
  const transportOptions = {
    'Beijing': {
      'airport': 'Beijing Capital International Airport (PEK)',
      'subway': 'Airport Express Line to Dongzhimen Station (¥25, 20-30 minutes)',
      'taxi': 'Approximately ¥100-150 to city center (30-45 minutes)',
      'bus': 'Airport Shuttle Bus lines to various city locations (¥20-30, 60-90 minutes)'
    },
    'Shanghai': {
      'airport': 'Shanghai Pudong International Airport (PVG)',
      'subway': 'Maglev Train + Metro Line 2 (¥50 + ¥4, 30 minutes)',
      'taxi': 'Approximately ¥150-200 to city center (45-60 minutes)',
      'bus': 'Airport Shuttle Bus lines to various city locations (¥20-30, 60-90 minutes)'
    }
  };
  
  // 默认使用北京的交通信息
  const transport = transportOptions[cityName] || transportOptions['Beijing'];
  
  let transportInfo = `### From ${transport.airport} to City Center

Depending on your budget and time constraints, you have several options:

#### By Public Transportation (Recommended)
* **${transport.subway}**
* Most economical and often fastest option during peak traffic hours
* Clear English signage and announcements

#### By Taxi
* **${transport.taxi}**
* Convenient but more expensive
* Show your driver the destination written in Chinese characters
* Ensure the driver uses the meter

#### By Airport Shuttle
* **${transport.bus}**
* Economical option with good comfort
* Less frequent departures than subway`;

  // 根据预算添加推荐
  if (budget === 'low') {
    transportInfo += `\n\n**Budget Recommendation:** Public transportation offers the best value and is efficient.`;
  } else if (budget === 'high') {
    transportInfo += `\n\n**Comfort Recommendation:** Taxi provides the most convenient door-to-door service.`;
  } else {
    transportInfo += `\n\n**Balanced Recommendation:** Public transportation for airport-to-city, then taxis for getting between attractions if needed.`;
  }
  
  return transportInfo;
};

/**
 * 生成模拟的餐饮推荐
 */
const generateDiningRecommendations = (cityName, budget, isFoodie) => {
  const cityFood = {
    'Beijing': {
      'local': ['Peking Duck', 'Zhajiangmian (Noodles with Soybean Paste)', 'Jianbing (Chinese Crepes)'],
      'budget': ['Mr. Shi\'s Dumplings', 'Huguosi Snack Street', 'Tongheju Restaurant'],
      'mid': ['Quanjude Roast Duck', 'Jin Ding Xuan', 'Najia Xiaoguan'],
      'high': ['TRB Hutong', 'King\'s Joy', 'Dadong Roast Duck']
    },
    'Shanghai': {
      'local': ['Xiaolongbao (Soup Dumplings)', 'Shengjianbao (Pan-fried Buns)', 'Hairy Crab'],
      'budget': ['Yang\'s Fried Dumplings', 'Jia Jia Tang Bao', 'Old Shanghai Food Court'],
      'mid': ['Din Tai Fung', 'Lost Heaven', 'Shanghai Uncle'],
      'high': ['Ultraviolet by Paul Pairet', 'Fu He Hui', 'Yi Long Court']
    }
  };
  
  // 默认使用北京的美食信息
  const food = cityFood[cityName] || cityFood['Beijing'];
  
  // 根据预算选择餐厅
  let restaurants;
  if (budget === 'low') {
    restaurants = food.budget;
  } else if (budget === 'high') {
    restaurants = food.high;
  } else {
    restaurants = food.mid;
  }
  
  // 生成餐饮推荐
  let diningContent = `### Must-Try Local Specialties
${food.local.map(dish => `* **${dish}**`).join('\n')}

### Recommended Restaurants
${restaurants.map(restaurant => `* **${restaurant}**`).join('\n')}`;

  // 如果用户对美食感兴趣，添加更多详细信息
  if (isFoodie) {
    diningContent += `\n\n### For Food Enthusiasts
* Consider a quick food tour if time permits
* Local markets offer authentic street food experiences
* Don't miss trying a traditional tea ceremony

### Food Safety Tips
* Drink bottled water
* Eat at busy establishments with high turnover
* Be cautious with street food if you have a sensitive stomach`;
  }
  
  return diningContent;
};

/**
 * API Response structure:
 * {
 *   success: boolean,
 *   data: {
 *     title: string,
 *     introduction: string,
 *     sections: Array<{
 *       title: string,
 *       content: string
 *     }>
 *   },
 *   error?: string
 * }
 */ 