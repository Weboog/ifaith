import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertTime' })
export class convertTime implements PipeTransform {
	transform(minutes: number){
		let hours: number = (minutes / 60);
		let minute = (hours - Math.floor(hours)) * 60;
		return Math.floor(hours) + ":" + Math.round(minute);
	}
}