import { describe, it, expect } from 'vitest';
import { generateHuangliData, generateDetailedFortune } from '../huangli-data';

describe('皇历数据生成', () => {
  it('应该生成有效的皇历数据', () => {
    const data = generateHuangliData();
    
    expect(data).toBeDefined();
    expect(data.date).toBeDefined();
    expect(data.date.gregorian).toBeTruthy();
    expect(data.date.lunar).toBeTruthy();
  });

  it('应该生成1-5星的运势评分', () => {
    const data = generateHuangliData();
    
    expect(data.fortune.score).toBeGreaterThanOrEqual(1);
    expect(data.fortune.score).toBeLessThanOrEqual(5);
  });

  it('应该生成宜忌列表', () => {
    const data = generateHuangliData();
    
    expect(Array.isArray(data.fortune.yi)).toBe(true);
    expect(Array.isArray(data.fortune.ji)).toBe(true);
    expect(data.fortune.yi.length).toBeGreaterThan(0);
    expect(data.fortune.ji.length).toBeGreaterThan(0);
  });

  it('应该生成程序员特色数据', () => {
    const data = generateHuangliData();
    
    expect(data.programmer.luckyLanguage).toBeTruthy();
    expect(data.programmer.languageLuck).toBeGreaterThanOrEqual(1);
    expect(data.programmer.languageLuck).toBeLessThanOrEqual(10);
    expect(data.programmer.codeType).toBeTruthy();
    expect(data.programmer.bugProbability).toBeGreaterThanOrEqual(10);
    expect(data.programmer.bugProbability).toBeLessThanOrEqual(40);
  });

  it('应该生成生活建议数据', () => {
    const data = generateHuangliData();
    
    expect(data.lifestyle.dressStyle).toBeTruthy();
    expect(data.lifestyle.luckyColor).toBeTruthy();
    expect(data.lifestyle.luckyNumber).toBeGreaterThanOrEqual(0);
    expect(data.lifestyle.luckyNumber).toBeLessThanOrEqual(9);
    expect(data.lifestyle.luckyDirection).toBeTruthy();
  });

  it('相同日期应该生成相同的数据', () => {
    const date = new Date(2024, 0, 1);
    const data1 = generateHuangliData(date);
    const data2 = generateHuangliData(date);
    
    expect(data1.fortune.score).toBe(data2.fortune.score);
    expect(data1.programmer.luckyLanguage).toBe(data2.programmer.luckyLanguage);
    expect(data1.lifestyle.luckyColor).toBe(data2.lifestyle.luckyColor);
  });
});

describe('详细运势生成', () => {
  it('应该生成四大运势', () => {
    const data = generateDetailedFortune();
    
    expect(data.aspects).toBeDefined();
    expect(data.aspects.length).toBe(4);
    
    data.aspects.forEach(aspect => {
      expect(aspect.name).toBeTruthy();
      expect(aspect.score).toBeGreaterThanOrEqual(1);
      expect(aspect.score).toBeLessThanOrEqual(5);
      expect(aspect.description).toBeTruthy();
    });
  });

  it('应该生成12个时辰', () => {
    const data = generateDetailedFortune();
    
    expect(data.timeSlots).toBeDefined();
    expect(data.timeSlots.length).toBe(12);
    
    data.timeSlots.forEach(slot => {
      expect(slot.time).toBeTruthy();
      expect(['吉', '平', '凶']).toContain(slot.luck);
    });
  });
});
