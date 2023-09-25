import { Injectable, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subject } from "../subject/subject.entity";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { PageMetaDto } from "../pagination/pageMeta.dto";
import { PageDto } from "../pagination/page.dto";
import { updateTimetableDTO } from "./dto/updateTimetable.dto";
import { addTimetableDTO } from "./dto/addTimetable.dto";
import { Timetable } from "./timetable.entity";
import { Course } from "src/course/course.entity";
import { timetableFilter } from "./dto/timetableFilter.dto";
import { scheduleCourseDTO } from "./dto/scheduleCourse.dto";

@Injectable()
export class TimetableService {


    constructor(
        @InjectRepository(Timetable)
        private readonly timetableRepository: Repository<Timetable>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>
    ) {
    }

    async getTimetable(timetableFilter: timetableFilter) {
        try {
            return this.timetableRepository.findOne({
                relations: {
                    courses: true
                },
                where: {
                    weekday: timetableFilter.weekday,
                    timeframe: timetableFilter.timeframe
                }
            })
        } catch (e) {
            throw e;
        }
    }

    async scheduleCourse(scheduleCourseDTO: scheduleCourseDTO) {
        try {
            const course = await this.courseRepository.findOne({
                relations: {
                    timetables: true,
                },
                where: {
                    id: scheduleCourseDTO.course_id,
                }
            });
            const timetable = await this.getTimetable({ timeframe: scheduleCourseDTO.timeframe, weekday: scheduleCourseDTO.weekday });
            if (course.timetables.find(time => time.id === timetable.id)) {
                throw new Error('This courses already shedule at this time');
            }
            if (!course.timetables) {
                course.timetables = [];
                course.timetables.push(timetable);
            } else {
                course.timetables.push(timetable);
            }
            return await this.courseRepository.save(course);
        } catch (e) {
            throw e;
        }
    }
    async deleteSchedule(course_id: number, timetable_id: number) {
        try {
            const course = await this.courseRepository.findOne({
                relations: {
                    timetables: true,
                },
                where: {
                    id: course_id,
                }
            });
            course.timetables = course.timetables.filter(time => { return time.id != timetable_id })
            console.log(course.timetables.filter(time => { return time.id !== timetable_id }));

            return await this.courseRepository.save(course);
        } catch (e) {
            throw e;
        }
    }

    async getTimetablePagination(
        pageOptionsDto: PageOptionsDto,
        timetableFilter: timetableFilter
    ) {
        try {
            const queryBuilder = this.timetableRepository.createQueryBuilder("timetable");
            const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;

            queryBuilder
                .orderBy("timetable.id", pageOptionsDto.order)
                .skip(skip)
                .take(pageOptionsDto.take);

            if (timetableFilter.weekday) {
                queryBuilder.where("timetable.weekday = :weekday", { weekday: timetableFilter.weekday });
            }

            if (timetableFilter.timeframe) {
                queryBuilder.where("timetable.timeframe = :timeframe", { timeframe: timetableFilter.timeframe });
            }

            const itemCount = await queryBuilder.getCount();
            const { entities } = await queryBuilder.getRawAndEntities();

            const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
            return new PageDto(entities, pageMeta);
        } catch (error) {
            throw error;
        }
    }

    async createTimetable(addTimetableDTO: addTimetableDTO) {
        try {
            return await this.timetableRepository.save(addTimetableDTO);
        } catch (e) {
            throw e;
        }
    }

    async deleteTimetable(id: number) {
        try {
            const found = await this.timetableRepository.findOneById(id);
            if (found === null) {
                throw new Error("Timetable not found");
            }
            return await this.timetableRepository.delete(id);
        } catch (e) {
            throw e;
        }
    }

    async updateTimetable(id: number, data: updateTimetableDTO) {
        try {
            const found = await this.timetableRepository.findOneById(id);
            if (found === null) {
                throw new Error("Timetable not found");
            }
            return await this.timetableRepository.update(id, data);
        } catch (e) {
            throw e;
        }
    }

    async getAllTimetables() {
        try {
            return await this.timetableRepository.find({
                relations: {
                    courses: true
                }
            });
        } catch (e) {
            throw e;
        }
    }
}
