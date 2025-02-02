ALTER TABLE "child" DROP CONSTRAINT "child_parent_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "question" DROP CONSTRAINT "question_test_id_test_id_fk";
--> statement-breakpoint
ALTER TABLE "submitted_answer" DROP CONSTRAINT "submitted_answer_test_id_test_id_fk";
--> statement-breakpoint
ALTER TABLE "submitted_answer" DROP CONSTRAINT "submitted_answer_question_id_question_id_fk";
--> statement-breakpoint
ALTER TABLE "submitted_answer" DROP CONSTRAINT "submitted_answer_test_submission_id_test_submission_id_fk";
--> statement-breakpoint
ALTER TABLE "test" DROP CONSTRAINT "test_child_id_child_id_fk";
--> statement-breakpoint
ALTER TABLE "test_submission" DROP CONSTRAINT "test_submission_test_id_test_id_fk";
--> statement-breakpoint
ALTER TABLE "test_submission" DROP CONSTRAINT "test_submission_child_id_child_id_fk";
--> statement-breakpoint
ALTER TABLE "child" ADD CONSTRAINT "child_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submitted_answer" ADD CONSTRAINT "submitted_answer_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submitted_answer" ADD CONSTRAINT "submitted_answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submitted_answer" ADD CONSTRAINT "submitted_answer_test_submission_id_test_submission_id_fk" FOREIGN KEY ("test_submission_id") REFERENCES "public"."test_submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test" ADD CONSTRAINT "test_child_id_child_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."child"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_submission" ADD CONSTRAINT "test_submission_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_submission" ADD CONSTRAINT "test_submission_child_id_child_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."child"("id") ON DELETE cascade ON UPDATE no action;