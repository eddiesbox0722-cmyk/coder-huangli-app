import { describe, it, expect, vi } from 'vitest';
import { fetchWeatherData } from '../weather-api';

// Mock fetch
global.fetch = vi.fn();

describe('天气API', () => {
  it('应该返回有效的天气数据结构', async () => {
    // Mock API响应
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_condition: [{
          temp_C: '22',
          humidity: '60',
          windspeedKmph: '12',
          weatherDesc: [{ value: 'Sunny' }],
          uvIndex: '5',
        }],
        weather: [{
          maxtempC: '26',
          mintempC: '18',
        }],
        nearest_area: [{
          areaName: [{ value: 'Beijing' }],
        }],
      }),
    });

    const data = await fetchWeatherData('Beijing');
    
    expect(data).toBeDefined();
    expect(data.weather).toBeDefined();
    expect(data.temperature).toBeDefined();
    expect(data.details).toBeDefined();
    expect(data.suggestion).toBeDefined();
    expect(data.location).toBeTruthy();
  });

  it('API失败时应该返回默认数据', async () => {
    // Mock API失败
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const data = await fetchWeatherData('Beijing');
    
    expect(data).toBeDefined();
    expect(data.weather.name).toBeTruthy();
    expect(data.temperature.current).toBeGreaterThan(0);
  });

  it('应该包含完整的温度信息', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_condition: [{
          temp_C: '22',
          humidity: '60',
          windspeedKmph: '12',
          weatherDesc: [{ value: 'Sunny' }],
          uvIndex: '5',
        }],
        weather: [{
          maxtempC: '26',
          mintempC: '18',
        }],
        nearest_area: [{
          areaName: [{ value: 'Beijing' }],
        }],
      }),
    });

    const data = await fetchWeatherData('Beijing');
    
    expect(data.temperature.current).toBe(22);
    expect(data.temperature.high).toBe(26);
    expect(data.temperature.low).toBe(18);
  });

  it('应该包含天气详情', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_condition: [{
          temp_C: '22',
          humidity: '60',
          windspeedKmph: '12',
          weatherDesc: [{ value: 'Sunny' }],
          uvIndex: '5',
        }],
        weather: [{
          maxtempC: '26',
          mintempC: '18',
        }],
        nearest_area: [{
          areaName: [{ value: 'Beijing' }],
        }],
      }),
    });

    const data = await fetchWeatherData('Beijing');
    
    expect(data.details.humidity).toBe(60);
    expect(data.details.windSpeed).toBe(12);
    expect(data.details.uvIndex).toBe(5);
    expect(data.details.uvLevel).toBeTruthy();
    expect(data.details.aqiLevel).toBeTruthy();
  });

  it('应该提供穿搭建议', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_condition: [{
          temp_C: '22',
          humidity: '60',
          windspeedKmph: '12',
          weatherDesc: [{ value: 'Sunny' }],
          uvIndex: '5',
        }],
        weather: [{
          maxtempC: '26',
          mintempC: '18',
        }],
        nearest_area: [{
          areaName: [{ value: 'Beijing' }],
        }],
      }),
    });

    const data = await fetchWeatherData('Beijing');
    
    expect(data.suggestion.dress).toBeTruthy();
    expect(typeof data.suggestion.dress).toBe('string');
  });
});
