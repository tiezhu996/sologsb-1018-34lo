import type { PracticeProject } from './types'

/**
 * 错词跟着文字走：逐条检查错词是否还在它所属意群的当前文字里。
 * 找不到的标成待重新归属（orphaned），重新出现的自动恢复。
 * 返回本次状态变化的条数。
 */
export function reconcileWordIssues(project: PracticeProject): number {
  let changed = 0
  for (const attempt of project.attempts) {
    for (const issue of attempt.wordIssues) {
      const group = project.groups.find((item) => item.id === issue.groupId)
      const found = !!group && !!issue.word && group.text.includes(issue.word)
      if (!issue.orphaned && !found) {
        issue.orphaned = true
        changed += 1
      } else if (issue.orphaned && found) {
        issue.orphaned = false
        changed += 1
      }
    }
  }
  return changed
}

/** 当前文字里含有这个词的意群，作为重新归属的候选。 */
export function candidateGroups(project: PracticeProject, word: string) {
  return project.groups.filter((group) => !!word && group.text.includes(word))
}
